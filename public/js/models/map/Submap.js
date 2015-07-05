// x, y are tile coords
Betteravia.Map.SubMap = function(module, tileX, tileY) {
    this.module = module;
    this.tileX = tileX || 0;
    this.tileY = tileY || 0;

    this.tileLayers = this.module.createLayers(
        'floor', 'indoor0', 'indoor1', 'outdoor0', 'outdoor1'
    );

    // We need to be able to position these.
    var layer;
    for (var key in this.tileLayers) {
        if (this.tileLayers.hasOwnProperty(key)) {
            layer = this.tileLayers[key];
            layer.fixedToCamera = false;
            layer.scrollFactorX = 0;
            layer.scrollFactorY = 0;
            layer.position.set(this.tileX*32, this.tileY*32);
        }
    }
};

Betteravia.Map.SubMap.prototype = {
    setPosition: function(x, y) {
        var layer;
        for (var key in this.tileLayers) {
            if (this.tileLayers.hasOwnProperty(key)) {
                layer = this.tileLayers[key];
                layer.position.set(x*32, y*32);
            }
        }
    },

    getAlpha: function(layer) {
        return this.tileLayers[layer].alpha;
    },

    setIndoorAlpha: function(alpha) {
        this.tileLayers['floor'].alpha = alpha;
        this.tileLayers['indoor0'].alpha = alpha;
        this.tileLayers['indoor1'].alpha = alpha;
    },

    setOutdoorAlpha: function(alpha) {
        this.tileLayers['outdoor0'].alpha = alpha;
        this.tileLayers['outdoor1'].alpha = alpha;
    }
};
