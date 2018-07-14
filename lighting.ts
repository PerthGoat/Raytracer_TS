/// <reference path='trace_gfx.ts'/>
/// <reference path='math_3d.ts'/>

/*
* Holds lighting information
*/

/*
* enum to hold light types
*/

enum LIGHT_TYPE {
	AMBIENT,
	POINT,
	DIRECTIONAL
}

/*
* Structure to hold lights
*/
class Light {
	constructor(
		public type : LIGHT_TYPE,
		public intensity : number,
		public position? : Vector3,
		public direction? : Vector3
	) {}
}

class Lighting {
	public static CalcLighting(P : Vector3, N : Vector3, lights : Light[]) : number {
		let i : number = 0;
		for(let l : number = 0;l < lights.length;l++) {
			let li : Light = lights[l];
			
			if(li.type == LIGHT_TYPE.AMBIENT) {
				i += li.intensity;
			} else {
				let L : Vector3 = undefined;
				
				if(li.type == LIGHT_TYPE.POINT) {
					L = Math_3D.SubtractVectors(li.position, P);
				} else {
					L = li.direction;
				}
				
				let n_dot_l : number = Math_3D.DotProduct(N, L);
				if(n_dot_l > 0) {
					i += li.intensity * n_dot_l / (Math_3D.VectorMagnitude(N) * Math_3D.VectorMagnitude(L));
				}
			}
		}
		
		return i;
	}
}