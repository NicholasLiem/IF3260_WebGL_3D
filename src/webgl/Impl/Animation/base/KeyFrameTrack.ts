import Scene from "../../Scene/Scene";
import Node from "../../Engine/Node"; // Import the correct Node type
import KeyFrame, { KeyFrameJSON } from "./KeyFrame";

export interface KeyFrameTrackJSON<T extends KeyFrameJSON<any>> {
    nodePath: string;
    keyFrames: T[];
    type : string;
}

export default abstract class KeyFrameTrack<T extends KeyFrame<any>>{
    public nodePath: string;
    public keyFrames: T[];
    public node: Node | null = null;

    constructor(nodePath: string, keyFrames: T[]) {
        this.nodePath = nodePath;
        this.keyFrames = keyFrames;
        this.node = null;
    }

    public bindNode(scene: Scene) {
        this.node = scene.getNodeFromPath(this.nodePath);
    }

    public abstract update(curFrame : number) : void;

    public abstract to_json() : KeyFrameTrackJSON<any>;
}