/*
* General purpose graphics library
*/

/*
* Structure to hold a 2D vector
*/
class Vector2 {
	constructor(
		public x: number,
		public y: number
	) { }

	public static Zero(): Vector2 { return new Vector2(0, 0); }
	public static One(): Vector2 { return new Vector2(1, 1); }

	public Add(V2: Vector2): Vector2 {
		return new Vector2(this.x + V2.x, this.y + V2.y);
	}
	public Subtract(V2: Vector2): Vector2 {
		return new Vector2(this.x - V2.x, this.y - V2.y);
	}
	public Magnitude(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	public Distance(V2: Vector2): number {
		return this.Subtract(V2).Magnitude();
	}
}

/*
* Structure to hold a 3D vector
*/
class Vector3 {
	constructor(
		public x: number,
		public y: number,
		public z: number
	) { }

	public static Zero(): Vector3 { return new Vector3(0, 0, 0); }
	public static One(): Vector3 { return new Vector3(1, 1, 1); }
	public static White(): Vector3 { return new Vector3(255, 255, 255); }

	// Add vector by another
	public Add(V2: Vector3): Vector3 {
		return new Vector3(this.x + V2.x, this.y + V2.y, this.z + V2.z);
	}

	// Subtract vector by another
	public Subtract(V2: Vector3): Vector3 {
		return new Vector3(this.x - V2.x, this.y - V2.y, this.z - V2.z);
	}

	// Dot product of two vectors
	public Dot(V2: Vector3): number {
		return this.x * V2.x + this.y * V2.y + this.z * V2.z;
	}

	// Cross product of two vectors
	public Cross(V2: Vector3): Vector3 {
		let cx: number = this.y * V2.z - this.z * V2.y;
		let cy: number = this.z * V2.x - this.x * V2.z;
		let cz: number = this.x * V2.y - this.y * V2.x;

		return new Vector3(cx, cy, cz);
	}

	// Magnitude (Length) of vector
	public Magnitude(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	// Vector multiplied by number
	public Multiply(N: number): Vector3 {
		return new Vector3(this.x * N, this.y * N, this.z * N);
	}

	// Vector multiplied by vector
	public MultiplyVector(V: Vector3): Vector3 {
		return new Vector3(this.x * V.x, this.y * V.y, this.z * V.z);
	}

	// Vector divided by number
	public Divide(N: number): Vector3 {
		return new Vector3(this.x / N, this.y / N, this.z / N);
	}

	// Unit (normalized) vector
	public Normalize(): Vector3 {
		return Math_3D.DivideVector(this, Math_3D.VectorMagnitude(this));
	}

	// Absolute value
	public Abs(): Vector3 {
		return new Vector3(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z));
	}
}

/*
* Class that controls graphical output
*/
class Graphics {
	private ctx: any;
	private buf8: any;
	private imageData: any;

	constructor(canvas: any, public w: number, public h: number) {
		canvas.width = w;
		canvas.height = h;
		this.ctx = canvas.getContext("2d");
		this.imageData = this.ctx.getImageData(0, 0, w, h); // get the image data in the canvas

		// now put the bytes into an off-screen buffer
		let buf: any = new ArrayBuffer(this.imageData.data.length);
		this.buf8 = new Uint8ClampedArray(buf);
	}

	/*
	* Put a pixel into our int buffer
	*/
	putPixel(pos: Vector2, color: Vector3): void {
		let offset: number = (pos.x + this.w * pos.y) * 4; // offset for pixels, 32-bit RGBA

		this.buf8[offset] = color.x; // red
		this.buf8[offset + 1] = color.y; // green
		this.buf8[offset + 2] = color.z; // blue
		this.buf8[offset + 3] = 255; // alpha
	}

	/*
	* Show the graphics buffer after drawing
	*/
	showBuffer(): void {
		this.imageData.data.set(this.buf8);

		this.ctx.putImageData(this.imageData, 0, 0);
	}
}