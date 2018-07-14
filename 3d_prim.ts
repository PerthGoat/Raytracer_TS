/// <reference path='trace_gfx.ts'/>

/*
* Holds 3D object primitives
*/

/*
* Structure to hold a sphere
*/
class Sphere {
	constructor(
		public center : Vector3,
		public radius : number,
		public color : Vector3,
		public specular : number
	) {}
}