const Matrix = require('./leds/matrix');
const AlternatingMatrix = require('./leds/alternating-matrix');
const SerpentineMatrix = require('./leds/serpentine-matrix');
const CanvasMatrix = require('./leds/canvas-matrix');

let path = require("path");
let addon = require(path.join(__dirname, "build", "Release", "rpi-ws281x.node"));

class Module {
    constructor() {
        this.map = undefined;
        this.leds = undefined;
        this.matrix = null;
    }

    configure(options) {
        const width = options.widows || undefined;
        const height = options.height || undefined;
        let map = options.map || undefined;
        let leds = options.leds || undefined;

        if (width !== undefined || height !== undefined) {

            if (width === undefined) {
                throw new Error('Must specify width if height is specified.');
            }

            if (height === undefined) {
                throw new Error('Must specify height if width is specified.');
            }

            if (leds !== undefined) {
                throw new Error('Please do not specify leds when both width and height are specified.');
            }

            leds = width * height;

            if (typeof map === 'string') {
                if (map === 'matrix') {
                    this.matrix = new Matrix(width, height);
                    map = this.matrix.getMap();
                } else if (map === 'alternating-matrix') {
                    this.matrix = new AlternatingMatrix(width, height);
                    map = this.matrix.getMap();
                } else if (map === 'serpentine-matrix') {
                    this.matrix = new SerpentineMatrix(width, height);
                    map = this.matrix.getMap();
                } else if (map === 'canvas-matrix') {
                    this.matrix = new CanvasMatrix(width, height);
                    map = this.matrix.getMap();
                }
            }
        }

        // Make sure the number of leds are specified
        if (leds === undefined) {
            throw new Error('Number of leds must be defined. Either by leds or by width and height.');
        }

        // If no map specified, create a default one...
        if (map === undefined) {
            map = new Uint32Array(leds);

            for (let i = 0; i < leds; i++) {
                map[i] = i;
            }
        }

        // Make sure we have a correct instance of pixel mapping
        if (!(map instanceof Uint32Array))
            throw new Error('Pixel mapping must be an Uint32Array.');

        if (map.length !== leds)
            throw new Error('Pixel mapping array must be of the same size as the number of leds.');

        this.map = map;
        this.leds = leds;

        addon.configure({...options, leds: leds});
    }

    getPixel(x, y) {
        return this.matrix.getByCoordinate(x, y);
    }

    reset() {
        if (this.leds !== undefined) {
            this.render(new Uint32Array(this.leds));
            addon.reset();
        }
    }

    sleep(ms) {
        addon.sleep(ms);
    }

    render(pixels) {
        if (this.map !== undefined)
            addon.render(pixels, this.map);
    }
}

module.exports = new Module();
