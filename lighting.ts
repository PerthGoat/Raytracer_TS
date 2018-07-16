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
        public type: LIGHT_TYPE,
        public intensity: number,
        public position?: Vector3,
        public direction?: Vector3
    ) { }
}

class Lighting {
    public static CalcLighting(P: Vector3, N: Vector3, V: Vector3, lights: Light[], s: number, sphereArray: Sphere[]): number {
        let i: number = 0;
        for (let l: number = 0; l < lights.length; l++) {
            let li: Light = lights[l];

            if (li.type == LIGHT_TYPE.AMBIENT) {
                i += li.intensity;
            } else {
                let L: Vector3 = (li.type == LIGHT_TYPE.POINT) ? li.position.Subtract(P) : li.direction;

                // shadows
                let hit: Ray_Result = Math_3D.IntersectAllSpheres(P, L.Add(N), sphereArray);
                if (hit.sphere != undefined) {
                    continue;
                }

                // diffuse lighting
                let n_dot_l: number = N.Dot(L);
                if (n_dot_l > 0) {
                    i += li.intensity * n_dot_l / (N.Magnitude() * L.Magnitude());
                }

                // specular lighting
                if (s != -1) {
                    let R4: Vector3 = N.Multiply(2).Multiply(N.Dot(L)).Subtract(L);

                    let r_dot_v: number = R4.Dot(V);
                    if (r_dot_v > 0) {
                        i += li.intensity * Math.pow(r_dot_v / (R4.Magnitude() * V.Magnitude()), s);
                    }
                }
            }
        }

        return i;
    }
}