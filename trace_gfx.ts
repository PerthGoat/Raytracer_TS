/*
* General purpose graphics library
*/

/*
* Structure to hold a 2D vector
*/
class Vector2 {
	constructor(
		public x : number,
		public y : number
	) {}
}

/*
* Structure to hold a 3D vector
*/
class Vector3 {
	constructor(
		public x : number,
		public y : number,
		public z : number
	) {}
}

/*
* Class that controls graphical output
*/
class Graphics {
	private ctx : any;
	private buf8 : any;
	private imageData : any;
	
	constructor(canvas : any, public w : number, public h : number) {
		canvas.width = w;
		canvas.height = h;
		this.ctx = canvas.getContext("2d");
		this.imageData = this.ctx.getImageData(0, 0, w, h); // get the image data in the canvas
		
		// now put the bytes into an off-screen buffer
		let buf : any = new ArrayBuffer(this.imageData.data.length);
		this.buf8 = new Uint8ClampedArray(buf);
	}
	
	/*
	* Put a pixel into our int buffer
	*/
	putPixel(pos : Vector2, color : Vector3) : void {
		let offset : number = (pos.y * this.w + pos.x) * 4; // offset for pixels, 32-bit RGBA
		
		this.buf8[offset + 3] = 255; // alpha
		this.buf8[offset] = color.x; // red
		this.buf8[offset + 1] = color.y; // green
		this.buf8[offset + 2] = color.z; // blue
	}
	
	/*
	* Show the graphics buffer after drawing
	*/
	showBuffer() : void {
		this.imageData.data.set(this.buf8);
		
		this.ctx.putImageData(this.imageData, 0, 0);
	}
}