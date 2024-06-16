import { Key } from "react";
import Vector3 from "../Type/Math/Vector3";
import Vec3KeyFrame, { Vec3KeyFrameJSON } from "./base/Vec3KeyFrame";
import Vec3KeyFrameTrack from "./base/Vec3KeyFrameTrack";
import { KeyFrameTrackJSON } from "./base/KeyFrameTrack";

export interface ScaleKeyFrameTrackJSON extends KeyFrameTrackJSON<Vec3KeyFrameJSON> {
    nodePath: string;
    keyFrames: Vec3KeyFrameJSON[];
}

export default class ScaleKeyFrameTrack extends Vec3KeyFrameTrack {
    constructor(nodePath: string, keyFrames: Vec3KeyFrame[]) {
        super(nodePath, keyFrames);
    }

    protected applyNewValue(newValue: Vector3): void {
        if (this.node) {
            this.node.scale = newValue;
        }
    }

    public static from_json(json: ScaleKeyFrameTrackJSON): ScaleKeyFrameTrack {
        const keyFrames = json.keyFrames.map((keyFrame) => {
            return Vec3KeyFrame.from_json(keyFrame);
        });
        return new ScaleKeyFrameTrack(json.nodePath, keyFrames);
    }

    public to_json(): ScaleKeyFrameTrackJSON {
        return {
            nodePath: this.nodePath,
            keyFrames: this.keyFrames.map((keyFrame) => {
                return keyFrame.to_json();
            }),
            type: "scale"
        }
    }
}