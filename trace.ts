/// <reference path='trace_gfx.ts'/>
/// <reference path='3d_prim.ts'/>
/// <reference path='math_3d.ts'/>
/// <reference path='lighting.ts'/>

function Render(resX: number = 256, resY: number = 256, samples: number = 0): void {
	// create the graphics context
	let canvas: any = document.getElementById("drawCanvas");

	let g: Graphics = new Graphics(canvas, resX, resY);

	// define the spheres
	let sphereArray: Sphere[] = [
		new Sphere(new Vector3(0, 1, 3), 1, new Vector3(255, 0, 0), 500),
		new Sphere(new Vector3(2, 0, 6), 1, new Vector3(0, 0, 255), 500),
		new Sphere(new Vector3(-2, 0, 4), 1, new Vector3(0, 255, 0), 10),
		new Sphere(new Vector3(0, -5001, 0), 5000, new Vector3(255, 255, 0), 1000),
	];

	// define the scene lights
	let lightArray: Light[] = [
		new Light(LIGHT_TYPE.POINT, 0.6, new Vector3(2, 1, 0)),
		new Light(LIGHT_TYPE.DIRECTIONAL, 0.2, undefined, new Vector3(1, 4, 4).Normalize()),
		new Light(LIGHT_TYPE.AMBIENT, 0.2)
	];

	let backgroundColor = new Vector3(255, 255, 255);

	// define camera pos and other stuff
	let camera: Vector3 = Vector3.Zero(); // camera is at the origin

	// Multi Sample Anti Aliasing
	let MSAA_samples: number = samples;

	let MSAA: Vector2[];
	if (MSAA_samples > 1) {// Randomly generate sample points within pixel
		PRNG.seed = 46;
		MSAA = Array(MSAA_samples);
		for (let i: number = 0; i < MSAA_samples; i++) {
			let max: Vector2;// Most distant sample from all other samples
			let maxD: number = 0;

			let tries: number = i == 0 ? 1 : 16;
			for (let j: number = 0; j < tries; j++) {
				//let cand: Vector2 = new Vector2(Math.random() - .5, Math.random() - .5);// random sample
				let cand: Vector2 = new Vector2(PRNG.Random() - .5, PRNG.Random() - .5);// pseudo random sample
				if (i == 0) {
					max = cand;
					continue;
				}
				else {
					let minD: number = 10;
					let min;

					for (let k: number = 0; k < i; k++) {
						let offsets: Vector2[] = [
							new Vector2(-1, 1), new Vector2(0, 1), Vector2.One(),
							new Vector2(-1, 0), Vector2.Zero(), new Vector2(1, 0),
							new Vector2(-1, -1), new Vector2(0, -1), new Vector2(1, -1)
						];

						let d: number = 10;
						for (let off of offsets) { d = Math.min(d, cand.Distance(MSAA[k].Add(off))); }
						if (d < minD) { minD = d; min = cand; }
					}

					if (minD > maxD) { maxD = minD; max = min; }
				}
			}

			MSAA[i] = max;
			//console.log("samp" + (i + 1) + " " + Math.round(MSAA[i].x * 10) / 10 + " " + Math.round(MSAA[i].y * 10) / 10);
		}
	} else if (MSAA_samples == -4) {// 4x MSAA
		MSAA = [
			new Vector2(-.25, .25),
			new Vector2(.25, .25),
			new Vector2(.25, -.25),
			new Vector2(-.25, -.25)
		];
	} else { MSAA = [new Vector2(0, 0)]; }// No MSAA

	if (MSAA_samples < 1) MSAA_samples = 1;

	let intAllSphT: number = 0, CalcLightingT: number = 0;
	let sT: number = performance.now();

	let minResDim: number = Math.min(g.w, g.h);

	for (let x: number = -g.w * .5; x < g.w * .5; x++) {
		for (let y: number = -g.h * .5; y < g.h * .5; y++) {
			let c: Vector3 = Vector3.Zero();

			for (let samp of MSAA) {
				let n: Vector3 = new Vector3((x + samp.x) / minResDim, (-y + samp.y) / minResDim, 1).Normalize();

				let hit: Ray_Result = Math_3D.IntersectAllSpheres(camera, n, sphereArray);

				c = c.Add(
					(hit.sphere != undefined) ?
						hit.sphere.color.Multiply(Lighting.CalcLighting(hit.hit_point, hit.hit_normal, n.Multiply(-1), lightArray, hit.sphere.specular, sphereArray))
						:
						backgroundColor
				);
			}

			g.putPixel(new Vector2(x + g.w * .5, y + g.h * .5), c.Divide(MSAA_samples));
		}
	}

	g.showBuffer();

	console.log("Total: " + Math.round(performance.now() - sT) * .001);
	//console.log(g.w);
}

Render(256, 256, 8);