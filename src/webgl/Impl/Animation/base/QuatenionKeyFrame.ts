import { EasingType } from "@/webgl/Utils/EasingFunction";
import Vector3 from "../../Type/Math/Vector3";
import Quaternion, { QuaternionJSON } from "../../Type/Quarternion";
import Keyframe, { KeyFrameJSON } from "./KeyFrame";

export interface QuaternionKeyFrameJSON extends KeyFrameJSON<QuaternionJSON> {
    frame: number;
    value: QuaternionJSON;
    interpolation: EasingType;
}

export default class QuaternionKeyFrame extends Keyframe<Quaternion> {
    constructor(frame: number, value: Quaternion, interpolation: EasingType) {
        super(frame, value, interpolation);
    }

    static fromEuler(frame: number, x: number, y: number, z: number, interpolation: EasingType): QuaternionKeyFrame {
        return new QuaternionKeyFrame(frame, Quaternion.fromEuler(new Vector3(x,y,z)), interpolation);
    }   

    to_json(): QuaternionKeyFrameJSON {
        return {
            frame: this.frame,
            value: this.value.to_json(),
            interpolation: this.interpolation
        }
    }

    static from_json(json: QuaternionKeyFrameJSON): QuaternionKeyFrame {
        return new QuaternionKeyFrame(json.frame, Quaternion.from_json(json.value), json.interpolation);
    }
}