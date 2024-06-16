import Vector3 from "../Type/Math/Vector3";
import { KeyFrameTrackJSON } from "./base/KeyFrameTrack";
import Vec3KeyFrame, { Vec3KeyFrameJSON } from "./base/Vec3KeyFrame";
import Vec3KeyFrameTrack from "./base/Vec3KeyFrameTrack";

export interface TranslationKeyFrameTrackJSON extends KeyFrameTrackJSON<Vec3KeyFrameJSON> {
    nodePath: string;
    keyFrames: Vec3KeyFrameJSON[];
}

export default class TranslationKeyFrameTrack extends Vec3KeyFrameTrack {
    constructor(nodePath: string, keyFrames: Vec3KeyFrame[]) {
        super(nodePath, keyFrames);
    }

    protected applyNewValue(newValue: Vector3): void {
        if (this.node) {
            this.node.translation = newValue;
        }
    }

    public static from_json(json: TranslationKeyFrameTrackJSON): TranslationKeyFrameTrack {
        const keyFrames = json.keyFrames.map((keyFrame) => {
            return Vec3KeyFrame.from_json(keyFrame);
        });
        return new TranslationKeyFrameTrack(json.nodePath, keyFrames);
    }

    public to_json(): TranslationKeyFrameTrackJSON {
        return {
            nodePath: this.nodePath,
            keyFrames: this.keyFrames.map((keyFrame) => {
                return keyFrame.to_json();
            }),
            type: "translation"
        }
    }
}