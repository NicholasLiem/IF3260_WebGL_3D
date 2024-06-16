import Color from "../Type/Color";

type TextureData = HTMLImageElement | Uint8Array;
type TextureDataInput = string | TextureData;
type ValueOf<T> = T[keyof T];

export const WrapMode = Object.freeze({
    ClampToEdge         : WebGLRenderingContext.CLAMP_TO_EDGE,
    Repeat              : WebGLRenderingContext.REPEAT,
    MirroredRepeat      : WebGLRenderingContext.MIRRORED_REPEAT,
});
export const MagFilter = Object.freeze({
    Nearest             : WebGLRenderingContext.NEAREST,
    Linear              : WebGLRenderingContext.LINEAR,
});
export const MinFilter = Object.freeze({
    Nearest             : WebGLRenderingContext.NEAREST,
    Linear              : WebGLRenderingContext.LINEAR,
    NearestMipmapNearest: WebGLRenderingContext.NEAREST_MIPMAP_NEAREST,
    NearestMipmapLinear : WebGLRenderingContext.NEAREST_MIPMAP_LINEAR,
    LinearMipmapNearest : WebGLRenderingContext.LINEAR_MIPMAP_NEAREST,
    LinearMipmapLinear  : WebGLRenderingContext.LINEAR_MIPMAP_LINEAR,
});
export const ImageFormat = Object.freeze({
    RGBA                : WebGLRenderingContext.RGBA,
    RGB                 : WebGLRenderingContext.RGB,
    LuminanceAlpha      : WebGLRenderingContext.LUMINANCE_ALPHA,
    Luminance           : WebGLRenderingContext.LUMINANCE,
});
export const ImageType = Object.freeze({
    UnsignedByte        : WebGLRenderingContext.UNSIGNED_BYTE,
    UnsignedShort4444   : WebGLRenderingContext.UNSIGNED_SHORT_4_4_4_4,
    UnsignedShort5551   : WebGLRenderingContext.UNSIGNED_SHORT_5_5_5_1,
    UnsignedShort565    : WebGLRenderingContext.UNSIGNED_SHORT_5_6_5,
});

export interface TextureJSON {
    wrapS: ValueOf<typeof WrapMode>;
    wrapT: ValueOf<typeof WrapMode>;
    minFilter: ValueOf<typeof MinFilter>;
    magFilter: ValueOf<typeof MagFilter>;
    format: ValueOf<typeof ImageFormat>;
    type: ValueOf<typeof ImageType>;
    defaultColor: [number, number, number, number];
    width: number;
    height: number;
    data?: string | number[];
}

export class Texture {
    private _img = new Image();
    private _data?: TextureData;
    private _callbackFn?: Function;
    private _width: number = 0;
    private _height: number = 0;
    private _defaultColor: Color = new Color(1, 1, 1, 1);

    public wrapS: ValueOf<typeof WrapMode> = WrapMode.ClampToEdge; // Repeat
    public wrapT: ValueOf<typeof WrapMode> = WrapMode.ClampToEdge; // Repeat
    public minFilter: ValueOf<typeof MinFilter> = MinFilter.Nearest; // NearestMipmapLinear
    public magFilter: ValueOf<typeof MagFilter> = MagFilter.Nearest;
    public format: ValueOf<typeof ImageFormat> = ImageFormat.RGBA;
    public type: ValueOf<typeof ImageType> = ImageType.UnsignedByte;

    public _texture: WebGLTexture | null = null; // For renderer
    public needsUpload = true;
    public parameterChanged = true;

    get isLoaded() { return this._data !== undefined; }
    get defaultColor() { return this._defaultColor; }
    get width() { return this._width; }
    get height() { return this._height; }
    get data() { return this._data; }

    constructor() {
        this._setLoader(this._img);
    }

    private _setLoader(image: HTMLImageElement) {
        image.onload = () => {
            this._data = this._img;
            this._callbackFn?.call(this);
            this.needsUpload = true;
        };
    }

    get img() {
        return this._data instanceof HTMLImageElement ? this._data : null;
    }
    
    get currentSrc() {
        return this.img ? this.img.currentSrc : '';
    }

    setData(data: string): void;
    setData(data: HTMLImageElement): void;
    setData(data: Uint8Array, width: number, height: number): void;
    setData(data?: TextureDataInput, width?: number, height?: number): void {
        if (typeof data === 'string') {
            this._img.src = data;
        } else {
            this._img.src = '';
            this._data = data;
            if (data === undefined) {
                this._data = undefined;
            } else if (data instanceof Uint8Array) {
                this._width = width!;
                this._height = height!;
            } else if (data instanceof HTMLImageElement) {
                this._data = data;
                this._width = data.width;
                this._height = data.height;
            }
        }
        this.needsUpload = true;
    }

    onLoad(callbackFn: Function) { this._callbackFn = callbackFn; }

    public delete(gl: WebGLRenderingContext) {
        if (this._texture) {
          gl.deleteTexture(this._texture);
          this._texture = null;
        }
    }

    to_json(): TextureJSON {
        let dataUrl: string | number[] | undefined;
        if (this._data instanceof HTMLImageElement) {
            const canvas = document.createElement('canvas');
            canvas.width = this._data.width;
            canvas.height = this._data.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(this._data, 0, 0);
            dataUrl = canvas.toDataURL();
        } else if (this._data instanceof Uint8Array) {
            dataUrl = Array.from(this._data);
        }

        return {
            wrapS: this.wrapS,
            wrapT: this.wrapT,
            minFilter: this.minFilter,
            magFilter: this.magFilter,
            format: this.format,
            type: this.type,
            defaultColor: this._defaultColor.toArray(),
            width: this._width,
            height: this._height,
            data: dataUrl,
        };
    }

    static from_json(json: TextureJSON): Texture {
        const texture = new Texture();
        texture.wrapS = json.wrapS;
        texture.wrapT = json.wrapT;
        texture.minFilter = json.minFilter;
        texture.magFilter = json.magFilter;
        texture.format = json.format;
        texture.type = json.type;
        texture._defaultColor = new Color(...json.defaultColor);
        texture._width = json.width;
        texture._height = json.height;

        if (json.data) {
            if (typeof json.data === 'string') {
                const img = new Image();
                img.src = json.data;
                texture.setData(img);
            } else if (Array.isArray(json.data)) {
                texture.setData(new Uint8Array(json.data), json.width, json.height);
            }
        }

        return texture;
    }
}
