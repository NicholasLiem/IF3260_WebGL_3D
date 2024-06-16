import Scene from "../Scene/Scene";
import KeyFrameTrack, { KeyFrameTrackJSON } from "./base/KeyFrameTrack";
import QuaternionKeyFrameTrack from "./QuatenionKeyFrameTrack";
import ScaleKeyFrameTrack from "./ScaleKeyFrameTrack";
import TranslationKeyFrameTrack from "./TranslationKeyFrameTack";

export interface AnimationClipJSON {
    name: string;
    duration: number;
    tracks: KeyFrameTrackJSON<any>[];
}

export class AnimationClip{
    public name : string;
    public duration : number; // in frames
    public tracks : KeyFrameTrack<any>[];

    constructor(name : string, duration : number){
        this.name = name;
        this.duration = duration;
        this.tracks = new Array<KeyFrameTrack<any>>();
    }

    public update(curFrame : number) : void {
        for (let track of this.tracks){
            track.update(curFrame);
        }
    }

    public bindNode(scene : Scene) : void {
        for (let track of this.tracks){
            track.bindNode(scene);
        }
    }

    public addTrack(track : KeyFrameTrack<any>) : void {
        this.tracks.push(track);
    }

    public static from_json(json : AnimationClipJSON) : AnimationClip {
        const clip = new AnimationClip(json.name, json.duration);
        clip.tracks = json.tracks.map((track) => {
            if (track.type === "translation"){
                return TranslationKeyFrameTrack.from_json(track);
            }
            if (track.type === "scale"){
                return ScaleKeyFrameTrack.from_json(track);
            }
            if (track.type === "quaternion"){
                return QuaternionKeyFrameTrack.from_json(track);
            }
            return undefined;
        }) as KeyFrameTrack<any>[];
        return clip;
    }

    public to_json() : AnimationClipJSON {
        return {
            name : this.name,
            duration : this.duration,
            tracks : this.tracks.map((track) => {
                return track.to_json();
            })
        }
    }
}