/*
* General purpose graphics library
*/
/*
* Structure to hold a 2D vector
*/
var Vector2 = /** @class */ (function () {
    function Vector2(x, y) {
        this.x = x;
        this.y = y;
    }
    return Vector2;
}());
/*
* Structure to hold a 3D vector
*/
var Vector3 = /** @class */ (function () {
    function Vector3(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    return Vector3;
}());
/*
* Class that controls graphical output
*/
var Graphics = /** @class */ (function () {
    function Graphics(canvas, w, h) {
        this.w = w;
        this.h = h;
        canvas.width = w;
        canvas.height = h;
        this.ctx = canvas.getContext("2d");
        this.imageData = this.ctx.getImageData(0, 0, w, h); // get the image data in the canvas
        // now put the bytes into an off-screen buffer
        var buf = new ArrayBuffer(this.imageData.data.length);
        this.buf8 = new Uint8ClampedArray(buf);
    }
    /*
    * Put a pixel into our int buffer
    */
    Graphics.prototype.putPixel = function (pos, color) {
        var offset = (pos.y * this.w + pos.x) * 4; // offset for pixels, 32-bit RGBA
        this.buf8[offset + 3] = 255; // alpha
        this.buf8[offset] = color.x; // red
        this.buf8[offset + 1] = color.y; // green
        this.buf8[offset + 2] = color.z; // blue
    };
    /*
    * Show the graphics buffer after drawing
    */
    Graphics.prototype.showBuffer = function () {
        this.imageData.data.set(this.buf8);
        this.ctx.putImageData(this.imageData, 0, 0);
    };
    return Graphics;
}());
