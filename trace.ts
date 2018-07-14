/// <reference path='trace_gfx.ts'/>
/// <reference path='3d_prim.ts'/>
/// <reference path='math_3d.ts'/>
/// <reference path='lighting.ts'/>

// create the graphics context
let canvas : any = document.getElementById("drawCanvas");

let g : Graphics = new Graphics(canvas, 1024, 1024);

// define the spheres
let sphereArray : Sphere[] = [
new Sphere(new Vector3(0, -1, 3), 1, new Vector3(255, 0, 0), 500),
new Sphere(new Vector3(2, 0, 4), 1, new Vector3(0, 0, 255), 500),
new Sphere(new Vector3(-2, 0, 4), 1, new Vector3(0, 255, 0), 10),
new Sphere(new Vector3(0, -5001, 0), 5000, new Vector3(255, 255, 0), 1000),
];

// define the scene lights
let lightArray : Light[] = [
new Light(LIGHT_TYPE.AMBIENT, 0.2),
new Light(LIGHT_TYPE.POINT, 0.6, new Vector3(2, 1, 0)),
new Light(LIGHT_TYPE.DIRECTIONAL, 0.2, undefined, new Vector3(1, 4, 4))
];

// define camera pos and other stuff
let camera : Vector3 = new Vector3(0, 0, 0); // camera is at the origin

for(let x : number = -g.w / 2;x < g.w / 2;x++) {
	for(let y : number = -g.h / 2;y < g.h / 2;y++) {
		let hit : Ray_Result = Math_3D.IntersectAllSpheres(camera, new Vector3(x / g.w, -y / g.h, 1), sphereArray);
		if(hit.sphere != undefined) {
			let ray_dir = Math_3D.UnitVector(new Vector3(x / g.w, -y / g.h, 1));
			let light_index : number = Lighting.CalcLighting(hit.hit_point, hit.hit_normal, new Vector3(-ray_dir.x, -ray_dir.y, -ray_dir.z), lightArray, hit.sphere.specular, sphereArray);
			g.putPixel(new Vector2(x + g.w / 2, y + g.w / 2), new Vector3(hit.sphere.color.x * light_index, hit.sphere.color.y * light_index, hit.sphere.color.z * light_index));
		} else {
			g.putPixel(new Vector2(x + g.w / 2, y + g.w / 2), new Vector3(255, 255, 255));
		}
		//console.log();
	}
}

g.showBuffer();
//console.log(g.w);