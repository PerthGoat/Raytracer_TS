/// <reference path='trace_gfx.ts'/>
/// <reference path='3d_prim.ts'/>

/*
* Holds the functions for doing 3D math
*/

interface Ray_Result {
	sphere : Sphere;
	distance : number;
	hit_point : Vector3;
	hit_normal : Vector3;
}

class Math_3D {
	
	/*
	* Add 2 3D vectors
	* Returns a Vector3 result
	*/
	public static AddVectors(V1 : Vector3, V2 : Vector3) : Vector3 {
		let a1 : number[] = [V1.x, V1.y, V1.z];
		let a2 : number[] = [V2.x, V2.y, V2.z];
		
		let result : number[] = a1.map(function(item, index) {
			return item + a2[index];
		});
		
		return new Vector3(result[0], result[1], result[2]);
	}
	
	/*
	* Subtract 2 3D vectors
	* Returns a Vector3 result
	*/
	public static SubtractVectors(V1 : Vector3, V2 : Vector3) : Vector3 {
		let a1 : number[] = [V1.x, V1.y, V1.z];
		let a2 : number[] = [V2.x, V2.y, V2.z];
		
		let result : number[] = a1.map(function(item, index) {
			return item - a2[index];
		});
		
		return new Vector3(result[0], result[1], result[2]);
	}
	
	/*
	* Gets the dot product of 2 3D vectors
	* Returns a scalar result
	*/
	public static DotProduct(V1 : Vector3, V2 : Vector3) : number {
		return V1.x * V2.x + V1.y * V2.y + V1.z * V2.z;
	}
	
	/*
	* Gets the cross product of 2 3D vectors
	* Returns a Vector3 result
	*/
	public static CrossProduct(V1 : Vector3, V2 : Vector3) : Vector3 {
		let cx : number = V1.y * V2.z - V1.z * V2.y;
		let cy : number = V1.z * V2.x - V1.x * V2.z;
		let cz : number = V1.x * V2.y - V1.y * V2.x;
		
		return new Vector3(cx, cy, cz);
	}
	
	/*
	* Gets the magnitude of a 3D vector
	* Returns a scalar result
	*/
	public static VectorMagnitude(V : Vector3) : number {
		return Math.sqrt(V.x * V.x + V.y * V.y + V.z * V.z);
	}
	
	/*
	* Gets the result of a vector multiplied by a number
	* Returns a Vector3 result
	*/
	public static MultiplyVector(V : Vector3, N : number) : Vector3 {
		return new Vector3(V.x * N, V.y * N, V.z * N);
	}
	
	/*
	* Gets the result of a vector divided by a number
	* Returns a Vector3 result
	*/
	public static DivideVector(V : Vector3, N : number) : Vector3 {
		return new Vector3(V.x / N, V.y / N, V.z / N);
	}
	
	/*
	* Gets the unit vector that represents a 3D vector
	* Returns a Vector3 result
	*/
	public static UnitVector(V : Vector3) : Vector3 {
		return Math_3D.DivideVector(V, Math_3D.VectorMagnitude(V));
	}
	
	/*
	* Returns the absolute value of a vector
	*/
	public static AbsVector(V : Vector3) : Vector3 {
		return new Vector3(Math.abs(V.x), Math.abs(V.y), Math.abs(V.z));
	}
	
	/*
	* Cast a ray to attempt to intersect with a sphere from start to end
	*/
	public static IntersectRaySphere(o : Vector3, lnn : Vector3, sphere : Sphere) : number {
		
		let l : Vector3 = Math_3D.UnitVector(lnn); // normalized ray direction
		
		let c : Vector3 = sphere.center;
		let r : number = sphere.radius;
		
		// part 1
		// -(l DOT (o - c))
		
		let oc : Vector3 = Math_3D.SubtractVectors(o, c); // o - c
		let ld : number = Math_3D.DotProduct(l, oc); // l DOT (o - c)
		
		let ldn : number = -ld; // -(l DOT (o - c))
		
		// part 2
		// number under radical
		
		let lds : number = ld * ld; // ld^2
		let mag : number = Math_3D.VectorMagnitude(oc); // || o - c ||
		mag = mag * mag;
		let result : number = lds - mag + r * r;
		let sq : number = Math.sqrt(result);
		
		let r1 : number = ldn - sq;
		let r2 : number = ldn + sq;
		
		if(r1 < r2) {
			return r1;
		} else {
			return r2;
		}
	}
	
	/*
	* Check all passed spheres for collision
	*/
	public static IntersectAllSpheres(o : Vector3, lnn : Vector3, sphereArray : Sphere[]) : Ray_Result {
		let l : Vector3 = Math_3D.UnitVector(lnn); // normalized ray direction
		
		// holds ending information
		let sphere : Sphere = undefined;
		let distance : number = 999;
		
		for(let i : number = 0;i < sphereArray.length;i++) {
			let t_dist : number = Math_3D.IntersectRaySphere(o, lnn, sphereArray[i]);
			if(distance > t_dist && t_dist >= 0) {
				distance = t_dist;
				sphere = sphereArray[i];
			}
		}
		
		if(sphere != undefined) {
			let P : Vector3 = Math_3D.AddVectors(o, Math_3D.MultiplyVector(l, distance)); // compute hit pos
			let N : Vector3 = Math_3D.SubtractVectors(P, sphere.center) // compute sphere normal
			let NORM : Vector3 = Math_3D.UnitVector(N); // gets the normalized normal
			return {sphere: sphere, distance: distance, hit_point: P, hit_normal: NORM};
		}
		
		return {sphere: sphere, distance: distance, hit_point: undefined, hit_normal: undefined};
	}
}