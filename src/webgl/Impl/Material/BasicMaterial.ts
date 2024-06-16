import { fragmentShaderSource as basicFragmentShaderSource } from '../../Shaders/Basic/BasicFragmentShaders';
import { vertexShaderSource as basicVertexShaderSource } from '../../Shaders/Basic/BasicVertexShaders';
import {
  ShaderMaterialJSON,
  ShaderMaterial,
  UniformSet,
} from './ShaderMaterial';
import Color from '../Type/Color';

type BasicMaterialOptions = {
  color: Color;
};

export interface BasicMaterialJSON extends ShaderMaterialJSON {
  color: string;
}

export class BasicMaterial extends ShaderMaterial {
  private _color: Color;

  constructor(options?: BasicMaterialOptions) {
    const { color } = options || {};
    super({
      vertexShader: basicVertexShaderSource,
      fragmentShader: basicFragmentShaderSource,
      uniforms: {
        color: color || Color.white(),
      },
    });
    this._color = this.uniforms['color'] as Color;
  }

  get color() {
    return this._color;
  }

  set color(color: Color) {
    this._color = color;
  }

  to_json(): BasicMaterialJSON {
    const baseJson = super.to_json();
    return {
      ...baseJson,
      color: this._color.to_json(),
    };
  }

  static from_json(json: BasicMaterialJSON): BasicMaterial {
    const uniforms: UniformSet = {};
    for (const key in json.uniforms) {
      uniforms[key] = json.uniforms[key];
    }
    const color = Color.from_json(json.color);
    return new BasicMaterial({ color});
  }
}
