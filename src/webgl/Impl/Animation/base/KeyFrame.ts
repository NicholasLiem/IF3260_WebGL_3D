import { EasingType } from "@/webgl/Utils/EasingFunction";

export interface KeyFrameJSON<T> {
    frame: number;
    value: T;
    interpolation: EasingType;
}

export default abstract class KeyFrame<T> {
    public frame: number;
    public value: T;
    public interpolation : EasingType;

    constructor(frame: number, value: T, interpolation: EasingType) {
        this.frame = frame;
        this.value = value;
        this.interpolation = interpolation;
    }
}