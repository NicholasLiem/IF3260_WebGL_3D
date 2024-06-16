import Scene from "@/webgl/Impl/Scene/Scene";
import Node from "@/webgl/Impl/Engine/Node";
import Vec3KeyFrame from "./Vec3KeyFrame";
import Vector3 from "../../Type/Math/Vector3";
import KeyFrameTrack from "./KeyFrameTrack";
import { Easing } from "@/webgl/Utils/EasingFunction";

export default abstract class Vec3KeyFrameTrack extends KeyFrameTrack<Vec3KeyFrame> {
    public update(curFrame : number) : void {
        if (this.node === null) {
            return;
        }
        if (this.keyFrames.length === 0) {
            return;
        }
        let found = false;
        for (let i = 0; i < this.keyFrames.length - 1 && !found; i++) {
            const keyFrame = this.keyFrames[i];
            const nextKeyFrame = this.keyFrames[i + 1];
            if (keyFrame.frame <= curFrame && curFrame <= nextKeyFrame.frame) {
                const t = (curFrame - keyFrame.frame) / (nextKeyFrame.frame - keyFrame.frame);
                const diff = nextKeyFrame.value.subtract(keyFrame.value);
                const multiplier = Easing(t, keyFrame.interpolation);
                const newValue = keyFrame.value.add(diff.multiply(multiplier));
                this.applyNewValue(newValue);    
                found = true;                                                                                                     
            }
        }
        if (!found) {
            if (curFrame < this.keyFrames[0].frame) {
                this.applyNewValue(this.keyFrames[0].value);
            }
            if (curFrame > this.keyFrames[this.keyFrames.length - 1].frame) {
                this.applyNewValue(this.keyFrames[this.keyFrames.length - 1].value);
            }
        }
    }

    protected abstract applyNewValue(newValue: Vector3): void;
}