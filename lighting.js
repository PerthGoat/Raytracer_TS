/// <reference path='trace_gfx.ts'/>
/// <reference path='math_3d.ts'/>
/*
* Holds lighting information
*/
/*
* enum to hold light types
*/
var LIGHT_TYPE;
(function (LIGHT_TYPE) {
    LIGHT_TYPE[LIGHT_TYPE["AMBIENT"] = 0] = "AMBIENT";
    LIGHT_TYPE[LIGHT_TYPE["POINT"] = 1] = "POINT";
    LIGHT_TYPE[LIGHT_TYPE["DIRECTIONAL"] = 2] = "DIRECTIONAL";
})(LIGHT_TYPE || (LIGHT_TYPE = {}));
/*
* Structure to hold lights
*/
var Light = /** @class */ (function () {
    function Light(type, intensity, position, direction) {
        this.type = type;
        this.intensity = intensity;
        this.position = position;
        this.direction = direction;
    }
    return Light;
}());
var Lighting = /** @class */ (function () {
    function Lighting() {
    }
    Lighting.CalcLighting = function (P, N, lights) {
        var i = 0;
        for (var l = 0; l < lights.length; l++) {
            var li = lights[l];
            if (li.type == LIGHT_TYPE.AMBIENT) {
                i += li.intensity;
            }
            else {
                var L = undefined;
                if (li.type == LIGHT_TYPE.POINT) {
                    L = Math_3D.SubtractVectors(li.position, P);
                }
                else {
                    L = li.direction;
                }
                var n_dot_l = Math_3D.DotProduct(N, L);
                if (n_dot_l > 0) {
                    i += li.intensity * n_dot_l / (Math_3D.VectorMagnitude(N) * Math_3D.VectorMagnitude(L));
                }
            }
        }
        return i;
    };
    return Lighting;
}());
