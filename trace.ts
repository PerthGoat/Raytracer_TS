/// <reference path='trace_gfx.ts'/>
/// <reference path='3d_prim.ts'/>
/// <reference path='math_3d.ts'/>
/// <reference path='lighting.ts'/>

// create the graphics context
let canvas: any = document.getElementById("drawCanvas");

let g: Graphics = new Graphics(canvas, 256, 256);

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
    new Light(LIGHT_TYPE.DIRECTIONAL, 0.2, undefined, new Vector3(1, 4, 4)),
    new Light(LIGHT_TYPE.AMBIENT, 0.2)
];

// define camera pos and other stuff
let camera: Vector3 = new Vector3(0, 0, 0); // camera is at the origin

// Multi Sample Anti Aliasing
let MSAA_samples: number = 8;

let MSAA: Vector2[];
if (MSAA_samples > 0) {// Randomly generate sample points within pixel, unbiased result
    MSAA = Array(MSAA_samples);
    for (let i: number = 0; i < MSAA_samples; i++) {
        MSAA[i] = new Vector2(Math.random() - .5, Math.random() - .5);
    }
} else if (MSAA_samples == 0) {
    MSAA = [new Vector2(0, 0)];
} else if (MSAA_samples == -4) {
    MSAA = [
        new Vector2(-.25, .25),
        new Vector2(.25, .25),
        new Vector2(.25, -.25),
        new Vector2(-.25, -.25)
    ];
}

let sT: number = performance.now();

for (let x: number = -g.w / 2; x < g.w / 2; x++) {
    for (let y: number = -g.h / 2; y < g.h / 2; y++) {
        let c: Vector3 = new Vector3(0, 0, 0);

        for (let samp of MSAA) {
            let v: Vector3 = new Vector3((x + samp.x) / g.w, (-y + samp.y) / g.h, 1);
            let hit: Ray_Result = Math_3D.IntersectAllSpheres(camera, v, sphereArray);
            if (hit.sphere != undefined) {
                c = c.Add(hit.sphere.color.Multiply(
                    Lighting.CalcLighting(hit.hit_point, hit.hit_normal, v.Normalize().Multiply(-1), lightArray, hit.sphere.specular, sphereArray)
                ));
            } else {
                c = c.Add(Vector3.White());
            }
            //console.log();
        }
        c = c.Divide(MSAA.length);

        g.putPixel(new Vector2(x + g.w / 2, y + g.w / 2), c);
    }
}

g.showBuffer();

console.log(Math.round(performance.now() - sT) / 1000);
//console.log(g.w);