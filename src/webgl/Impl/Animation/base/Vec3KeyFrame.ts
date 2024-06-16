import { EasingType } from "@/webgl/Utils/EasingFunction";
import Vector3, { Vector3JSON } from "../../Type/Math/Vector3";
import KeyFrame from "./KeyFrame";

export interface Vec3KeyFrameJSON{
    frame: number;
    value: Vector3JSON
    interpolation: EasingType;
}

export default class Vec3KeyFrame extends KeyFrame<Vector3> {
    constructor(frame: number, value: Vector3, interpolation: EasingType) {
        super(frame, value, interpolation);
    }

    to_json(): Vec3KeyFrameJSON {
        return {
            frame: this.frame,
            value: this.value.to_json(),
            interpolation: this.interpolation
        }
    }

    static from_json(json: Vec3KeyFrameJSON): Vec3KeyFrame {
        return new Vec3KeyFrame(json.frame, Vector3.from_json(json.value), json.interpolation);
    }
}