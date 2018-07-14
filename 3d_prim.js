/// <reference path='trace_gfx.ts'/>
/*
* Holds 3D object primitives
*/
/*
* Structure to hold a sphere
*/
var Sphere = /** @class */ (function () {
    function Sphere(center, radius, color, specular) {
        this.center = center;
        this.radius = radius;
        this.color = color;
        this.specular = specular;
    }
    return Sphere;
}());
