export enum EasingType {
    inOutSine,
    outSine,
    outCubic,
    outExpo,
    outElastic,
    outBounce,
    linear,
}


export function Easing(x : number , type : EasingType) {
    switch (type) {
        case EasingType.inOutSine:
            return inOutSine(x);
        case EasingType.outSine:
            return outSine(x);
        case EasingType.outCubic:
            return outCubic(x);
        case EasingType.outExpo:
            return outExpo(x);
        case EasingType.outElastic:
            return outElastic(x);
        case EasingType.outBounce:
            return outBounce(x);
        case EasingType.linear:
            return x;
    }
}


function inOutSine(x: number) {
    return -(Math.cos(Math.PI * x) - 1) / 2;
}

function outSine(x: number) {
    return Math.sin((x * Math.PI) / 2);
}

function outCubic(x: number) {
    return 1 - Math.pow(1 - x, 3);
}

function outExpo(x: number) {
    return x === 1 ? x : 1 - Math.pow(2, -10 * x);
}

function outElastic(x : number) {
    const c4 = (2 * Math.PI) / 3;

    return x === 0
    ? 0
    : x === 1
    ? 1
    : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}

function outBounce(x : number) {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (x < 1 / d1) {
        return n1 * x * x;
    } else if (x < 2 / d1) {
        return n1 * (x -= 1.5 / d1) * x + 0.75;
    } else if (x < 2.5 / d1) {
        return n1 * (x -= 2.25 / d1) * x + 0.9375;
    } else {
        return n1 * (x -= 2.625 / d1) * x + 0.984375;
}
}

