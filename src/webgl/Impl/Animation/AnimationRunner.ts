import Scene from "../Scene/Scene";
import Node from "@/webgl/Impl/Engine/Node";
import { AnimationClip, AnimationClipJSON } from "./AnimationClip";

export default class AnimationRunner {
    isPlaying: boolean = false;
    isReverse: boolean = false;
    isLoop: boolean = false;
    fps: number = 30;
    private scene : Scene;
    private currentFrame: number = 0;
    private deltaFrame: number = 0;
    private _currentAnimation?: AnimationClip;


    constructor(animationClip : AnimationClip, scene: Scene, { fps = 30 } = {}) {
        this.scene = scene;
        this._currentAnimation = animationClip;
        if (this._currentAnimation) {
            this._currentAnimation.bindNode(this.scene);
        }
        this.fps = fps;
    }
   
    get currentAnimation() {
        return this._currentAnimation;
    }

    set currentAnimation(animation: AnimationClip | undefined) { // Update the type to allow for undefined values
        this._currentAnimation = animation;
        if (this._currentAnimation) {
            this._currentAnimation.bindNode(this.scene);
        }
    }

    set Scene(scene: Scene) {
        this.scene = scene;
        if (this._currentAnimation) {
            this._currentAnimation.bindNode(this.scene);
        }
    }

    get CurrentFrame() {
        return this.currentFrame;
    }

    set CurrentFrame(frame: number) {
        this.currentFrame = frame;
    }
   
    get duration() {
        return this.currentAnimation!.duration;
    }


    update(deltaSecond: number) {
        if (this.isPlaying) {
            this.deltaFrame = deltaSecond * this.fps;
            if (this.isReverse) {
                this.CurrentFrame = this.currentFrame - this.deltaFrame;
                if (this.isLoop) {
                    if (this.currentFrame < 0) {
                        this.currentFrame = this.currentAnimation!.duration + this.currentFrame;
                    }
                } else {
                    if (this.currentFrame <= 0) {
                        this.CurrentFrame = 0;
                        this.isPlaying = false;
                    }
                }
            } else {
                this.CurrentFrame = this.currentFrame + this.deltaFrame;
                if (this.isLoop) {
                    this.currentFrame = this.currentFrame % this.currentAnimation!.duration;
                } else {
                    if (this.currentFrame >= this.currentAnimation!.duration) {
                        this.CurrentFrame = this.currentAnimation!.duration;
                        this.isPlaying = false;
                    }
                }
            }
            this.updateSceneGraph();
        }
    }

    updateToFrame(frame: number) {
        this.currentFrame = frame;
        this.updateSceneGraph();
    }

    refreshBindNode() {
        if (this.currentAnimation) {
            this.currentAnimation.bindNode(this.scene);
        }
    }

    private updateSceneGraph() {
        this.currentAnimation!.update(this.currentFrame);
    }
}
