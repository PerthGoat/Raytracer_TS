/// <reference path='trace_gfx.ts'/>
/// <reference path='3d_prim.ts'/>
/// <reference path='math_3d.ts'/>
/// <reference path='lighting.ts'/>
// create the graphics context
var canvas = document.getElementById("drawCanvas");
var g = new Graphics(canvas, 512, 512);
// define the spheres
var sphereArray = [
    new Sphere(new Vector3(0, -1, 3), 1, new Vector3(255, 0, 0)),
    new Sphere(new Vector3(2, 0, 4), 1, new Vector3(0, 0, 255)),
    new Sphere(new Vector3(-2, 0, 4), 1, new Vector3(0, 255, 0)),
    new Sphere(new Vector3(0, -5001, 0), 5000, new Vector3(255, 255, 0)),
];
// define the scene lights
var lightArray = [
    new Light(LIGHT_TYPE.AMBIENT, 0.2),
    new Light(LIGHT_TYPE.POINT, 0.6, new Vector3(2, 1, 0)),
    new Light(LIGHT_TYPE.DIRECTIONAL, 0.2, undefined, new Vector3(1, 4, 4))
];
// define camera pos and other stuff
var camera = new Vector3(0, 0, 0); // camera is at the origin
for (var x = -g.w / 2; x < g.w / 2; x++) {
    for (var y = -g.h / 2; y < g.h / 2; y++) {
        var hit = Math_3D.IntersectAllSpheres(camera, new Vector3(x / g.w, -y / g.h, 1), sphereArray);
        if (hit.sphere != undefined) {
            var light_index = Lighting.CalcLighting(hit.hit_point, hit.hit_normal, lightArray);
            g.putPixel(new Vector2(x + g.w / 2, y + g.w / 2), new Vector3(hit.sphere.color.x * light_index, hit.sphere.color.y * light_index, hit.sphere.color.z * light_index));
        }
        //console.log();
    }
}
g.showBuffer();
//console.log(g.w);
