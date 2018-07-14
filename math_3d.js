/// <reference path='trace_gfx.ts'/>
/// <reference path='3d_prim.ts'/>
var Math_3D = /** @class */ (function () {
    function Math_3D() {
    }
    /*
    * Add 2 3D vectors
    * Returns a Vector3 result
    */
    Math_3D.AddVectors = function (V1, V2) {
        var a1 = [V1.x, V1.y, V1.z];
        var a2 = [V2.x, V2.y, V2.z];
        var result = a1.map(function (item, index) {
            return item + a2[index];
        });
        return new Vector3(result[0], result[1], result[2]);
    };
    /*
    * Subtract 2 3D vectors
    * Returns a Vector3 result
    */
    Math_3D.SubtractVectors = function (V1, V2) {
        var a1 = [V1.x, V1.y, V1.z];
        var a2 = [V2.x, V2.y, V2.z];
        var result = a1.map(function (item, index) {
            return item - a2[index];
        });
        return new Vector3(result[0], result[1], result[2]);
    };
    /*
    * Gets the dot product of 2 3D vectors
    * Returns a scalar result
    */
    Math_3D.DotProduct = function (V1, V2) {
        return V1.x * V2.x + V1.y * V2.y + V1.z * V2.z;
    };
    /*
    * Gets the cross product of 2 3D vectors
    * Returns a Vector3 result
    */
    Math_3D.CrossProduct = function (V1, V2) {
        var cx = V1.y * V2.z - V1.z * V2.y;
        var cy = V1.z * V2.x - V1.x * V2.z;
        var cz = V1.x * V2.y - V1.y * V2.x;
        return new Vector3(cx, cy, cz);
    };
    /*
    * Gets the magnitude of a 3D vector
    * Returns a scalar result
    */
    Math_3D.VectorMagnitude = function (V) {
        return Math.sqrt(V.x * V.x + V.y * V.y + V.z * V.z);
    };
    /*
    * Gets the result of a vector multiplied by a number
    * Returns a Vector3 result
    */
    Math_3D.MultiplyVector = function (V, N) {
        return new Vector3(V.x * N, V.y * N, V.z * N);
    };
    /*
    * Gets the result of a vector divided by a number
    * Returns a Vector3 result
    */
    Math_3D.DivideVector = function (V, N) {
        return new Vector3(V.x / N, V.y / N, V.z / N);
    };
    /*
    * Gets the unit vector that represents a 3D vector
    * Returns a Vector3 result
    */
    Math_3D.UnitVector = function (V) {
        return Math_3D.DivideVector(V, Math_3D.VectorMagnitude(V));
    };
    /*
    * Returns the absolute value of a vector
    */
    Math_3D.AbsVector = function (V) {
        return new Vector3(Math.abs(V.x), Math.abs(V.y), Math.abs(V.z));
    };
    /*
    * Cast a ray to attempt to intersect with a sphere from start to end
    */
    Math_3D.IntersectRaySphere = function (o, lnn, sphere) {
        var l = Math_3D.UnitVector(lnn); // normalized ray direction
        var c = sphere.center;
        var r = sphere.radius;
        // part 1
        // -(l DOT (o - c))
        var oc = Math_3D.SubtractVectors(o, c); // o - c
        var ld = Math_3D.DotProduct(l, oc); // l DOT (o - c)
        var ldn = -ld; // -(l DOT (o - c))
        // part 2
        // number under radical
        var lds = ld * ld; // ld^2
        var mag = Math_3D.VectorMagnitude(oc); // || o - c ||
        mag = mag * mag;
        var result = lds - mag + r * r;
        var sq = Math.sqrt(result);
        var r1 = ldn - sq;
        var r2 = ldn + sq;
        if (r1 < r2) {
            return r1;
        }
        else {
            return r2;
        }
    };
    /*
    * Check all passed spheres for collision
    */
    Math_3D.IntersectAllSpheres = function (o, lnn, sphereArray) {
        var l = Math_3D.UnitVector(lnn); // normalized ray direction
        // holds ending information
        var sphere = undefined;
        var distance = 999;
        for (var i = 0; i < sphereArray.length; i++) {
            var t_dist = Math_3D.IntersectRaySphere(o, lnn, sphereArray[i]);
            if (distance > t_dist && t_dist >= 0) {
                distance = t_dist;
                sphere = sphereArray[i];
            }
        }
        if (sphere != undefined) {
            var P = Math_3D.AddVectors(o, Math_3D.MultiplyVector(l, distance)); // compute hit pos
            var N = Math_3D.SubtractVectors(P, sphere.center); // compute sphere normal
            var NORM = Math_3D.UnitVector(N); // gets the normalized normal
            return { sphere: sphere, distance: distance, hit_point: P, hit_normal: NORM };
        }
        return { sphere: sphere, distance: distance, hit_point: undefined, hit_normal: undefined };
    };
    return Math_3D;
}());
