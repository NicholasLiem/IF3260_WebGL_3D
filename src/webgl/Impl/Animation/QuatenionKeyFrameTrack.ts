import Scene from "@/webgl/Impl/Scene/Scene";
import Node from "@/webgl/Impl/Engine/Node";
import Vec3KeyFrame from "./base/Vec3KeyFrame";
import Vector3 from "../Type/Math/Vector3";
import QuarternionKeyFrame, { QuaternionKeyFrameJSON } from "./base/QuatenionKeyFrame";
import Quaternion from "../Type/Quarternion";
import KeyFrameTrack, { KeyFrameTrackJSON } from "./base/KeyFrameTrack";
import { Easing } from "@/webgl/Utils/EasingFunction";

interface QuarternionKeyFrameTrackJSON extends KeyFrameTrackJSON<QuaternionKeyFrameJSON> {
    nodePath: string;
    keyFrames: QuaternionKeyFrameJSON[];
}

export default class QuaternionKeyFrameTrack extends KeyFrameTrack<QuarternionKeyFrame> {

    constructor(nodePath: string, keyFrames: QuarternionKeyFrame[]) {
        super(nodePath, keyFrames);
    }

    public update(curFrame : number) {
        if (this.node === null) {
            return null;
        }
        if (this.keyFrames.length === 0) {
            return null;
        }
        let found = false;
        for (let i = 0; i < this.keyFrames.length - 1 && !found; i++) {
            const keyFrame = this.keyFrames[i];
            const nextKeyFrame = this.keyFrames[i + 1];
            if (keyFrame.frame <= curFrame && curFrame < nextKeyFrame.frame) {
                const t = (curFrame - keyFrame.frame) / (nextKeyFrame.frame - keyFrame.frame);
                const multiplier = Easing(t, keyFrame.interpolation);
                const newValue = Quaternion.slerp(keyFrame.value, nextKeyFrame.value, multiplier);
                this.node.quaternion = newValue;
                found = true;                                                                                                        
            }
        }
        if (!found) {
            if (curFrame < this.keyFrames[0].frame) {
                this.node.quaternion = this.keyFrames[0].value;
            }
            if (curFrame > this.keyFrames[this.keyFrames.length - 1].frame) {
                this.node.quaternion = this.keyFrames[this.keyFrames.length - 1].value;
            }
        }
        
    }

    public static from_json(json: QuarternionKeyFrameTrackJSON): QuaternionKeyFrameTrack {
        const keyFrames = json.keyFrames.map((keyFrame) => {
            return QuarternionKeyFrame.from_json(keyFrame);
        });
        return new QuaternionKeyFrameTrack(json.nodePath, keyFrames);
    }

    public to_json(): KeyFrameTrackJSON<QuaternionKeyFrameJSON> {
        return {
            nodePath: this.nodePath,
            keyFrames: this.keyFrames.map((keyFrame) => {
                return keyFrame.to_json();
            }),
            type: "quaternion"
        }
    }

}