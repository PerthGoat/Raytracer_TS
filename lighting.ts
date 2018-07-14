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
	public static CalcLighting(P : Vector3, N : Vector3, V : Vector3, lights : Light[], s : number, sphereArray : Sphere[]) : number {
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
				
				let new_l : Vector3 = Math_3D.AddVectors(L, N);
				// shadows
				let hit : Ray_Result = Math_3D.IntersectAllSpheres(P, new_l, sphereArray);
				if(hit.sphere != undefined) {
					continue;
				}
				
				// diffuse lighting
				let n_dot_l : number = Math_3D.DotProduct(N, L);
				if(n_dot_l > 0) {
					i += li.intensity * n_dot_l / (Math_3D.VectorMagnitude(N) * Math_3D.VectorMagnitude(L));
				}
				
				// specular lighting
				if(s != -1) {
					let R1 : Vector3 = Math_3D.MultiplyVector(N, 2);
					let R2 : number = Math_3D.DotProduct(N, L);
					let R3 : Vector3 = Math_3D.MultiplyVector(R1, R2);
					let R4 : Vector3 = Math_3D.SubtractVectors(R3, L);
					
					let r_dot_v : number = Math_3D.DotProduct(R4, V);
					if(r_dot_v > 0) {
						i += li.intensity * Math.pow(r_dot_v / (Math_3D.VectorMagnitude(R4) * Math_3D.VectorMagnitude(V)), s);
					}
				}
			}
		}
		
		return i;
	}
}