var frame_time = 60/1000; // run the local game at 16ms/ 60hz

if('undefined' != typeof(global)) frame_time = 45; //on server we run at 45ms, 22hz

(function() {

    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];

    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[ vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if(!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = Date.now(), timeToCall = Math.max(0, frame_time - (currTime - lastTime));

            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);

            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if(!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) { clearTimeout(id); };
    }

}());


function Core(server) {
    //Store a flag if we are the server
    this.server = server;

    //Used in collision etc.
    this.world = {
        width : 720,
        height : 480
    };

    //We create a player set, passing them
    //the game that is running them, as well
    this.players = {};

    //The speed at which the clients move.
    this.playerspeed = 120;

    //Set up some physics integration values
    this._pdt = 0.0001;                 //The physics update delta time
    this._pdte = new Date().getTime();  //The physics update last delta time

    //A local timer for precision on server and client
    this.local_time = 0.016;            //The local timer
    this._dt = new Date().getTime();    //The local timer delta
    this._dte = new Date().getTime();   //The local timer last frame time

    //Start a physics loop, this is separate to the rendering
    //as this happens at a fixed frequency
    this.create_physics_simulation();

    //Start a fast paced timer for measuring time easier
    this.create_timer();

    //Client specific initialisation
    if(!this.server) {
        this.localPlayer = '1';

        //Create a keyboard handler
        this.keyboard = new THREEx.KeyboardState();

        //Create the default configuration settings
        this.client_create_configuration();

        //A list of recent server updates we interpolate across
        //This is the buffer that is the driving factor for our networking
        this.server_updates = [];

        //Connect to the socket.io server!
        this.client_connect_to_server();

        //We start pinging the server to determine latency
        this.client_create_ping_timer();
    } else { //if !server
        this.server_time = 0;
        this.laststate = {};
    }
};

// (4.22208334636).fixed(n) will return fixed point value to n places, default n = 3
Number.prototype.fixed = function(n) { n = n || 3; return parseFloat(this.toFixed(n)); };
//copies a 2d vector like object from one to another
Core.prototype.pos = function(a) { return {x: a.x, y: a.y}; };
//Add a 2d vector with another one and return the resulting vector
Core.prototype.v_add = function(a,b) { return { x:(a.x+b.x).fixed(), y:(a.y+b.y).fixed() }; };
//Subtract a 2d vector with another one and return the resulting vector
Core.prototype.v_sub = function(a,b) { return { x:(a.x-b.x).fixed(),y:(a.y-b.y).fixed() }; };
//Multiply a 2d vector with a scalar value and return the resulting vector
Core.prototype.v_mul_scalar = function(a,b) { return {x: (a.x*b).fixed() , y:(a.y*b).fixed() }; };
//For the server, we need to cancel the setTimeout that the polyfill creates
Core.prototype.stop_update = function() {  window.cancelAnimationFrame( this.updateid );  };
//Simple linear interpolation
Core.prototype.lerp = function(p, n, t) { var _t = Number(t); _t = (Math.max(0, Math.min(1, _t))).fixed(); return (p + _t * (n - p)).fixed(); };
//Simple linear interpolation between 2 vectors
Core.prototype.v_lerp = function(v,tv,t) { return { x: this.lerp(v.x, tv.x, t), y:this.lerp(v.y, tv.y, t) }; };

Core.prototype.update = function(t) {
    //Work out the delta time
    this.dt = this.lastframetime ? ((t - this.lastframetime) / 1000.0).fixed() : 0.016;

    //Store the last frame time
    this.lastframetime = t;

    //Update the game specifics
    if(!this.server) {
        this.client_update();
    } else {
        this.server_update();
    }

    //schedule the next update
    this.updateid = window.requestAnimationFrame(this.update.bind(this), this.viewport);

};

Core.prototype.addPlayer = function(player) {
    this.players[player.uid] = player;
};

Core.prototype.check_collision = function( item ) {
    //Left wall.
    if(item.pos.x <= item.pos_limits.x_min) {
        item.pos.x = item.pos_limits.x_min;
    }

    //Right wall
    if(item.pos.x >= item.pos_limits.x_max ) {
        item.pos.x = item.pos_limits.x_max;
    }

    //Roof wall.
    if(item.pos.y <= item.pos_limits.y_min) {
        item.pos.y = item.pos_limits.y_min;
    }

    //Floor wall
    if(item.pos.y >= item.pos_limits.y_max ) {
        item.pos.y = item.pos_limits.y_max;
    }

    //Fixed point helps be more deterministic
    item.pos.x = item.pos.x.fixed(4);
    item.pos.y = item.pos.y.fixed(4);

};

Core.prototype.process_input = function(player) {
    //It's possible to have recieved multiple inputs by now,
    //so we process each one
    var x_dir = 0;
    var y_dir = 0;
    var ic = player.inputs.length;
    if(ic) {
        for(var j = 0; j < ic; ++j) {
            //don't process ones we already have simulated locally
            if(player.inputs[j].seq <= player.last_input_seq) continue;

            var input = player.inputs[j].inputs;
            var c = input.length;
            for(var i = 0; i < c; ++i) {
                var key = input[i];
                if(key == 'l') {
                    x_dir -= 1;
                }
                if(key == 'r') {
                    x_dir += 1;
                }
                if(key == 'd') {
                    y_dir += 1;
                }
                if(key == 'u') {
                    y_dir -= 1;
                }
            }

        }
    }

    //we have a direction vector now, so apply the same physics as the client
    var resulting_vector = this.physics_movement_vector_from_direction(x_dir,y_dir);
    if(player.inputs.length) {
        //we can now clear the array since these have been processed
        player.last_input_time = player.inputs[ic-1].time;
        player.last_input_seq = player.inputs[ic-1].seq;
    }

    //give it back
    return resulting_vector;

};

Core.prototype.physics_movement_vector_from_direction = function(x, y) {
    //Must be fixed step, at physics sync speed.
    return {
        x: (x * (this.playerspeed * 0.015)).fixed(),
        y: (y * (this.playerspeed * 0.015)).fixed()
    };

};

Core.prototype.update_physics = function() {
    if(this.server) {
        this.server_update_physics();
    } else {
        this.client_update_physics();
    }

};

/*

 Server side functions

    These functions below are specific to the server side only,
    and usually start with server_* to make things clearer.

*/

//Updated at 15ms , simulates the world state
Core.prototype.server_update_physics = function() {
    for(var uid in this.players) {
        var player = this.players[uid];

        // Don't run on inherited Object properties
        if(!this.players.hasOwnProperty(player)) {
            continue;
        }

        player.old_state.pos = this.pos(player.pos);

        var new_dir = this.process_input(player);
        player.pos = this.v_add(player.old_state.pos, new_dir);

        //Keep the physics position in the world
        this.check_collision(players);

        //we have cleared the input buffer, so remove this
        player.inputs = [];
    }
};

//Makes sure things run smoothly and notifies clients of changes
//on the server side
Core.prototype.server_update = function() {
    //Update the state of our local clock to match the timer
    this.server_time = this.local_time;

    //Make a snapshot of the current state, for updating the clients
    this.laststate = {
        server_time: this.server_time               // current local time on server
    };
    for(var uid in this.players) {
        var player = this.players[uid];

        // Don't run on inherited Object properties
        if(!this.players.hasOwnProperty(player)) {
            continue;
        }

        this.laststate.userid = {
            position: player.pos,                   // player's position
            last_input_seq: player.last_input_seq   // last input processed for player
        }
    }

    //Send the snapshot to each player
    for(var uid in this.players) {
        var player = this.players[uid];

        // Don't run on inherited Object properties
        if(!this.players.hasOwnProperty(player)) {
            continue;
        }

        player.client.emit('onserverupdate', this.laststate);
    }
};


Core.prototype.handle_server_input = function(client, input, input_time, input_seq) {
    //Fetch which client this refers to
    var player_client = this.players[client.uid];

    //Store the input on the player instance for processing in the physics loop
    player_client.inputs.push({
        inputs: input,
        time: input_time,
        seq: input_seq
    });
};


/*

 Client side functions

    These functions below are specific to the client side only,
    and usually start with client_* to make things clearer.

*/

Core.prototype.client_handle_input = function() {
    //This takes input from the client and keeps a record,
    //It also sends the input information to the server immediately
    //as it is pressed. It also tags each input with a sequence number.
    var x_dir = 0;
    var y_dir = 0;
    var input = [];
    this.client_has_input = false;

    if( this.keyboard.pressed('A') ||
        this.keyboard.pressed('left')) {

            x_dir = -1;
            input.push('l');

        } //left

    if( this.keyboard.pressed('D') ||
        this.keyboard.pressed('right')) {

            x_dir = 1;
            input.push('r');

        } //right

    if( this.keyboard.pressed('S') ||
        this.keyboard.pressed('down')) {

            y_dir = 1;
            input.push('d');

        } //down

    if( this.keyboard.pressed('W') ||
        this.keyboard.pressed('up')) {

            y_dir = -1;
            input.push('u');

        } //up

    if(input.length) {
        //Update what sequence we are on now
        this.input_seq += 1;

        //Store the input state as a snapshot of what happened.
        this.players[this.localPlayer].inputs.push({
            inputs: input,
            time: this.local_time.fixed(3),
            seq: this.input_seq
        });

        //Send the packet of information to the server.
        //The input packets are labelled with an 'i' in front.
        var server_packet = 'i.';
            server_packet += input.join('-') + '.';
            server_packet += this.local_time.toFixed().replace('.','-') + '.';
            server_packet += this.input_seq;

        //Go
        this.socket.send(server_packet);

        //Return the direction if needed
        return this.physics_movement_vector_from_direction(x_dir, y_dir);
    } else {
        return {x:0, y:0};
    }

};

Core.prototype.client_process_net_prediction_correction = function() {
    //No updates...
    if(!this.server_updates.length) return;

    //The most recent server update
    var latest_server_data = this.server_updates[this.server_updates.length - 1];

    //Our latest server position
    var my_server_pos = this.players.self.host ? latest_server_data.hp : latest_server_data.cp;

    //here we handle our local input prediction,
    //by correcting it with the server and reconciling its differences

    var my_last_input_on_server = latest_server_data[this.localPlayer].last_input_seq;
    if(my_last_input_on_server) {
        //The last input sequence index in my local input list
        var lastinputseq_index = -1;

        //Find this input in the list, and store the index
        for(var i = 0; i < this.players[this.localPlayer].inputs.length; ++i) {
            if(this.players[this.localPlayer].inputs[i].seq == my_last_input_on_server) {
                lastinputseq_index = i;
                break;
            }
        }

        //Now we can crop the list of any updates we have already processed
        if(lastinputseq_index != -1) {
            //so we have now gotten an acknowledgement from the server that our inputs here have been accepted
            //and that we can predict from this known position instead

            //remove the rest of the inputs we have confirmed on the server
            var number_to_clear = Math.abs(lastinputseq_index - (-1));
            this.players[this.localPlayer].inputs.splice(0, number_to_clear);
            //The player is now located at the new server position, authoritive server
            this.players[this.localPlayer].cur_state.pos = this.pos(my_server_pos);
            this.players[this.localPlayer].last_input_seq = lastinputseq_index;
            //Now we reapply all the inputs that we have locally that
            //the server hasn't yet confirmed. This will 'keep' our position the same,
            //but also confirm the server position at the same time.
            this.client_update_physics();
            this.client_update_local_position();

        }
    }
};

Core.prototype.client_process_net_updates = function() {
    //No updates...
    if(!this.server_updates.length) return;

    //First : Find the position in the updates, on the timeline
    //We call this current_time, then we find the past_pos and the target_pos using this,
    //searching throught the server_updates array for current_time in between 2 other times.
    // Then :  other player position = lerp ( past_pos, target_pos, current_time );

    //Find the position in the timeline of updates we stored.
    var current_time = this.client_time;
    var count = this.server_updates.length - 1;
    var target = null;
    var previous = null;

    //We look from the 'oldest' updates, since the newest ones
    //are at the end (list.length-1 for example). This will be expensive
    //only when our time is not found on the timeline, since it will run all
    //samples. Usually this iterates very little before breaking out with a target.
    for(var i = 0; i < count; ++i) {
        var point = this.server_updates[i];
        var next_point = this.server_updates[i+1];

        //Compare our point in time with the server times we have
        if(current_time > point.t && current_time < next_point.t) {
            target = next_point;
            previous = point;
            break;
        }
    }

    //With no target we store the last known
    //server position and move to that instead
    if(!target) {
        target = this.server_updates[0];
        previous = this.server_updates[0];
    }

    //Now that we have a target and a previous destination,
    //We can interpolate between then based on 'how far in between' we are.
    //This is simple percentage maths, value/target = [0,1] range of numbers.
    //lerp requires the 0,1 value to lerp to? thats the one.

     if(target && previous) {
        this.target_time = target.t;

        var difference = this.target_time - current_time;
        var max_difference = (target.t - previous.t).fixed();
        var time_point = (difference/max_difference).fixed();

        //Because we use the same target and previous in extreme cases
        //It is possible to get incorrect values due to division by 0 difference
        //and such. This is a safe guard and should probably not be here. lol.
        if( isNaN(time_point) ) time_point = 0;
        if(time_point == -Infinity) time_point = 0;
        if(time_point == Infinity) time_point = 0;

        //The most recent server update
        var latest_server_data = this.server_updates[this.server_updates.length - 1];

        for(var uid in this.players) {
            var player = this.players[uid];

            // Don't run on inherited Object properties
            if(!this.players.hasOwnProperty(player)) {
                continue;
            }

            // Don't run on local player
            if(player.userid == this.localPlayer) {
                continue;
            }

            player.pos = this.v_lerp(player.pos, target[player.userid].position, this._pdt * this.client_smooth);
        }
    }
};

Core.prototype.client_onserverupdate_recieved = function(data){
    //Store the server time (this is offset by the latency in the network, by the time we get it)
    this.server_time = data.t;
    //Update our local offset time from the last server update
    this.client_time = this.server_time - (this.net_offset / 1000);

    //One approach is to set the position directly as the server tells you.
    //This is a common mistake and causes somewhat playable results on a local LAN, for example,
    //but causes terrible lag when any ping/latency is introduced. The player can not deduce any
    //information to interpolate with so it misses positions, and packet loss destroys this approach
    //even more so. See 'the bouncing ball problem' on Wikipedia.

    //Cache the data from the server,
    //and then play the timeline
    //back to the player with a small delay (net_offset), allowing
    //interpolation between the points.
    this.server_updates.push(data);

    //we limit the buffer in seconds worth of updates
    //60fps*buffer seconds = number of samples
    if(this.server_updates.length >= ( 60*this.buffer_size )) {
        this.server_updates.splice(0,1);
    }

    //We can see when the last tick we know of happened.
    //If client_time gets behind this due to latency, a snap occurs
    //to the last tick. Unavoidable, and a reallly bad connection here.
    //If that happens it might be best to drop the game after a period of time.
    this.oldest_tick = this.server_updates[0].t;

    //Handle the latest positions from the server
    //and make sure to correct our local predictions, making the server have final say.
    this.client_process_net_prediction_correction();
};

Core.prototype.client_update_local_position = function(){
    //Work out the time we have since we updated the state
    var t = (this.local_time - this.players[this.localPlayer].state_time) / this._pdt;

    //Then store the states for clarity,
    var old_state = this.players[this.localPlayer].old_state.pos;
    var current_state = this.players[this.localPlayer].cur_state.pos;

    //Make sure the visual position matches the states we have stored
    this.players[this.localPlayer].pos = current_state;

    //We handle collision on client if predicting.
    this.check_collision(this.players[this.localPlayer]);
};

Core.prototype.client_update_physics = function() {
    //Fetch the new direction from the input buffer,
    //and apply it to the state so we can smooth it in the visual state

    this.players[this.localPlayer].old_state.pos = this.pos( this.players[this.localPlayer].cur_state.pos );
    var nd = this.process_input(this.players[this.localPlayer]);
    this.players[this.localPlayer].cur_state.pos = this.v_add( this.players[this.localPlayer].old_state.pos, nd);
    this.players[this.localPlayer].state_time = this.local_time;
};

Core.prototype.client_update = function() {
    //Clear the screen area
    this.ctx.clearRect(0,0,720,480);

    //draw help/information if required
    this.client_draw_info();

    //Capture inputs from the player
    this.client_handle_input();

    //Network player just gets drawn normally, with interpolation from
    //the server updates, smoothing out the positions from the past.
    //Note that if we don't have prediction enabled - this will also
    //update the actual local client position on screen as well.
    this.client_process_net_updates();

    //Now they should have updated, we can draw the entity
    for(var uid in this.players) {
        var player = this.players[uid];

        // Don't run on inherited Object properties
        if(!this.players.hasOwnProperty(player)) {
            continue;
        }

        // Don't run on local player
        if(player.userid == this.localPlayer) {
            continue;
        }

        player.draw();
    }

    //When we are doing client side prediction, we smooth out our position
    //across frames using local input states we have stored.
    this.client_update_local_position();

    //And then we finally draw
    this.players[this.localPlayer].draw();

    //Work out the fps average
    this.client_refresh_fps();

};

Core.prototype.create_timer = function(){
    setInterval(function(){
        this._dt = new Date().getTime() - this._dte;
        this._dte = new Date().getTime();
        this.local_time += this._dt/1000.0;
    }.bind(this), 4);
}

Core.prototype.create_physics_simulation = function() {
    setInterval(function(){
        this._pdt = (new Date().getTime() - this._pdte)/1000.0;
        this._pdte = new Date().getTime();
        this.update_physics();
    }.bind(this), 15);
};


Core.prototype.client_create_ping_timer = function() {

        //Set a ping timer to 1 second, to maintain the ping/latency between
        //client and server and calculated roughly how our connection is doing

    setInterval(function(){

        this.last_ping_time = new Date().getTime() - this.fake_lag;
        this.socket.send('p.' + (this.last_ping_time) );

    }.bind(this), 1000);

}; //Core.client_create_ping_timer


Core.prototype.client_create_configuration = function() {

    this.show_help = false;             //Whether or not to draw the help text
    this.naive_approach = false;        //Whether or not to use the naive approach
    this.show_server_pos = false;       //Whether or not to show the server position
    this.show_dest_pos = false;         //Whether or not to show the interpolation goal
    this.client_predict = true;         //Whether or not the client is predicting input
    this.input_seq = 0;                 //When predicting client inputs, we store the last input as a sequence number
    this.client_smoothing = true;       //Whether or not the client side prediction tries to smooth things out
    this.client_smooth = 25;            //amount of smoothing to apply to client update dest

    this.net_latency = 0.001;           //the latency between the client and the server (ping/2)
    this.net_ping = 0.001;              //The round trip time from here to the server,and back
    this.last_ping_time = 0.001;        //The time we last sent a ping
    this.fake_lag = 0;                //If we are simulating lag, this applies only to the input client (not others)
    this.fake_lag_time = 0;

    this.net_offset = 100;              //100 ms latency between server and client interpolation for other clients
    this.buffer_size = 2;               //The size of the server history to keep for rewinding/interpolating.
    this.target_time = 0.01;            //the time where we want to be in the server timeline
    this.oldest_tick = 0.01;            //the last time tick we have available in the buffer

    this.client_time = 0.01;            //Our local 'clock' based on server time - client interpolation(net_offset).
    this.server_time = 0.01;            //The time the server reported it was at, last we heard from it

    this.dt = 0.016;                    //The time that the last frame took to run
    this.fps = 0;                       //The current instantaneous fps (1/this.dt)
    this.fps_avg_count = 0;             //The number of samples we have taken for fps_avg
    this.fps_avg = 0;                   //The current average fps displayed in the debug UI
    this.fps_avg_acc = 0;               //The accumulation of the last avgcount fps samples

    this.lit = 0;
    this.llt = new Date().getTime();

};

Core.prototype.client_reset_positions = function() {
    for(var uid in this.players) {
        var player = this.players[uid];

        // Don't run on inherited Object properties
        if(!this.players.hasOwnProperty(player)) {
            continue;
        }

        player.pos = { x:20, y:20 };
    }

    //Make sure the local player physics is updated
    this.players[this.localPlayer].old_state.pos = this.pos(this.players[this.localPlayer].pos);
    this.players[this.localPlayer].pos = this.pos(this.players[this.localPlayer].pos);
    this.players[this.localPlayer].cur_state.pos = this.pos(this.players[this.localPlayer].pos);

};

Core.prototype.client_onreadygame = function(data) {
    var server_time = parseFloat(data.replace('-','.'));

    this.local_time = server_time + this.net_latency;
    console.log('server time is about ' + this.local_time);

    //Store their info colors and state for clarity.
    for(var uid in this.players) {
        var player = this.players[uid];

        // Don't run on inherited Object properties
        if(!this.players.hasOwnProperty(player)) {
            continue;
        }

        player.info_color = '#2288cc';
        player.state = 'local_pos(joined)';
    }

    this.players[this.localPlayer].state = 'YOU ' + this.players[this.localPlayer].state;

    //Make sure colors are synced up
    this.socket.send('c.' + this.players[this.localPlayer].color);
};

Core.prototype.client_onjoingame = function(data) {
    //We are not the host
    this.players[this.localPlayer].host = false;
    //Update the local state
    this.players[this.localPlayer].state = 'connected.joined.waiting';
    this.players[this.localPlayer].info_color = '#00bb00';

    //Make sure the positions match servers and other clients
    this.client_reset_positions();

};

Core.prototype.client_onhostgame = function(data) {
    //The server sends the time when asking us to host, but it should be a new game.
    //so the value will be really small anyway (15 or 16ms)
    var server_time = parseFloat(data.replace('-','.'));

    //Get an estimate of the current time on the server
    this.local_time = server_time + this.net_latency;

    //Set the flag that we are hosting, this helps us position respawns correctly
    this.players[this.localPlayer].host = true;

    //Update debugging information to display state
    this.players[this.localPlayer].state = 'hosting.waiting for a player';
    this.players[this.localPlayer].info_color = '#cc0000';

    //Make sure we start in the correct place as the host.
    this.client_reset_positions();

};

Core.prototype.client_onconnected = function(data) {
    //The server responded that we are now in a game,
    //this lets us store the information about ourselves and set the colors
    //to show we are now ready to be playing.
    this.players[this.localPlayer].id = data.id;
    this.players[this.localPlayer].info_color = '#cc0000';
    this.players[this.localPlayer].state = 'connected';
    this.players[this.localPlayer].online = true;

};

Core.prototype.client_on_otherclientcolorchange = function(data) {
    // this.players.other.color = data;
};

Core.prototype.client_onping = function(data) {
    this.net_ping = new Date().getTime() - parseFloat( data );
    this.net_latency = this.net_ping/2;
};

Core.prototype.client_onnetmessage = function(data) {
    var commands = data.split('.');
    var command = commands[0];
    var subcommand = commands[1] || null;
    var commanddata = commands[2] || null;

    switch(command) {
        case 's': //server message

            switch(subcommand) {

                case 'h' : //host a game requested
                    this.client_onhostgame(commanddata); break;

                case 'j' : //join a game requested
                    this.client_onjoingame(commanddata); break;

                case 'r' : //ready a game requested
                    this.client_onreadygame(commanddata); break;

                case 'e' : //end game requested
                    this.client_ondisconnect(commanddata); break;

                case 'p' : //server ping
                    this.client_onping(commanddata); break;

                case 'c' : //other player changed colors
                    this.client_on_otherclientcolorchange(commanddata); break;

            }

        break;
    }

};

Core.prototype.client_ondisconnect = function(data) {
    //When we disconnect, we don't know if the other player is
    //connected or not, and since we aren't, everything goes to offline
    this.players[this.localPlayer].info_color = 'rgba(255,255,255,0.1)';
    this.players[this.localPlayer].state = 'not-connected';
    this.players[this.localPlayer].online = false;

    for(var uid in this.players) {
        var player = this.players[uid];

        // Don't run on inherited Object properties
        if(!this.players.hasOwnProperty(player)) {
            continue;
        }

        player.info_color = 'rgba(255,255,255,0.1)';
        player.other.state = 'not-connected';
    }
};

Core.prototype.client_connect_to_server = function() {
    //Store a local reference to our connection to the server
    this.socket = io.connect();

    //When we connect, we are not 'connected' until we have a server id
    //and are placed in a game by the server. The server sends us a message for that.
    this.socket.on('connect', function(){
        this.players[this.localPlayer].state = 'connecting';
    }.bind(this));

    //Sent when we are disconnected (network, server down, etc)
    this.socket.on('disconnect', this.client_ondisconnect.bind(this));
    //Sent each tick of the server simulation. This is our authoritive update
    this.socket.on('onserverupdate', this.client_onserverupdate_recieved.bind(this));
    //Handle when we connect to the server, showing state and storing id's.
    this.socket.on('onconnected', this.client_onconnected.bind(this));
    //On error we just show that we are not connected for now. Can print the data.
    this.socket.on('error', this.client_ondisconnect.bind(this));
    //On message from the server, we parse the commands and send it to the handlers
    this.socket.on('message', this.client_onnetmessage.bind(this));

}; //Core.client_connect_to_server


Core.prototype.client_refresh_fps = function() {

        //We store the fps for 10 frames, by adding it to this accumulator
    this.fps = 1/this.dt;
    this.fps_avg_acc += this.fps;
    this.fps_avg_count++;

        //When we reach 10 frames we work out the average fps
    if(this.fps_avg_count >= 10) {

        this.fps_avg = this.fps_avg_acc/10;
        this.fps_avg_count = 1;
        this.fps_avg_acc = this.fps;

    } //reached 10 frames

}; //Core.client_refresh_fps


Core.prototype.client_draw_info = function() {

        //We don't want this to be too distracting
    this.ctx.fillStyle = 'rgba(255,255,255,0.3)';

        //They can hide the help with the debug GUI
    if(this.show_help) {

        this.ctx.fillText('net_offset : local offset of others players and their server updates. Players are net_offset "in the past" so we can smoothly draw them interpolated.', 10 , 30);
        this.ctx.fillText('server_time : last known game time on server', 10 , 70);
        this.ctx.fillText('client_time : delayed game time on client for other players only (includes the net_offset)', 10 , 90);
        this.ctx.fillText('net_latency : Time from you to the server. ', 10 , 130);
        this.ctx.fillText('net_ping : Time from you to the server and back. ', 10 , 150);
        this.ctx.fillText('fake_lag : Add fake ping/lag for testing, applies only to your inputs (watch server_pos block!). ', 10 , 170);
        this.ctx.fillText('client_smoothing/client_smooth : When updating players information from the server, it can smooth them out.', 10 , 210);
        this.ctx.fillText(' This only applies to other clients when prediction is enabled, and applies to local player with no prediction.', 170 , 230);

    } //if this.show_help

    //Draw some information for the host
    console.log('players', this.players);
    if(this.players[this.localPlayer].host) {

        this.ctx.fillStyle = 'rgba(255,255,255,0.7)';
        this.ctx.fillText('You are the host', 10 , 465);

    } //if we are the host


        //Reset the style back to full white.
    this.ctx.fillStyle = 'rgba(255,255,255,1)';

};

module.exports = Core;
