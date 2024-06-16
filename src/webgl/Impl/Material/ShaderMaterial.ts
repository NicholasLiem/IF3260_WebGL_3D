import { fragmentShaderSource as defaultFragmentShaderSource } from '../../Shaders/Basic/BasicFragmentShaders';
import { vertexShaderSource as defaultVertexShaderSource } from '../../Shaders/Basic/BasicVertexShaders';
import { Texture } from './Texture';

export type UniformType = Iterable<number> | WebGLTexture | Texture | undefined | null; 
export type UniformSet<T = UniformType> = { [key: string]: T };
type ShaderMaterialOptions = {
  vertexShader?: string;
  fragmentShader?: string;
  uniforms?: UniformSet;
};

export interface ShaderMaterialJSON {
  id: string;
  uniforms: { [key: string]: any };
}

export class ShaderMaterial {
  private static idCounter = 0;

  private readonly _id: string = 'M' + ShaderMaterial.idCounter++;
  private readonly _vertexShader: string;
  private readonly _fragmentShader: string;
  private _uniforms: UniformSet = {};

  constructor(options: ShaderMaterialOptions) {
    const {
      vertexShader = defaultVertexShaderSource,
      fragmentShader = defaultFragmentShaderSource,
      uniforms,
    } = options;
    this._vertexShader = vertexShader!;
    this._fragmentShader = fragmentShader!;
    this._uniforms = uniforms || this._uniforms;
  }

  get id() {
    return this._id;
  }

  get vertexShader() {
    return this._vertexShader;
  }

  get fragmentShader() {
    return this._fragmentShader;
  }

  get uniforms() {
    return this._uniforms;
  }

  equals(material: ShaderMaterial) {
    return this._id == material._id;
  }

  to_json(): ShaderMaterialJSON {
    const uniforms: { [key: string]: any } = {};
    for (const key in this._uniforms) {
      const uniform = this._uniforms[key];
      if (uniform instanceof WebGLTexture || uniform instanceof Texture) {
        uniforms[key] = null;
      } else if (Array.isArray(uniform) || typeof uniform === 'object' && uniform !== null && Symbol.iterator in Object(uniform)) {
        uniforms[key] = Array.from(uniform as Iterable<number>);
      } else {
        uniforms[key] = uniform;
      }
    }
    return {
      id: this._id,
      uniforms,
    };
  }
  

  static from_json(json: ShaderMaterialJSON): ShaderMaterial {
    const uniforms: UniformSet = {};
    for (const key in json.uniforms) {
      uniforms[key] = json.uniforms[key];
    }
    return new ShaderMaterial({
      uniforms,
    });
  }
}
