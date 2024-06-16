import { fragmentShaderSource as phongFragmentShaderSource } from '../../Shaders/Phong/PhongFragmentShaders';
import { vertexShaderSource as phongVertexShaderSource } from '../../Shaders/Phong/PhongVertexShaders';
import Color from '../Type/Color';
import { ShaderMaterial, ShaderMaterialJSON, UniformSet } from './ShaderMaterial';
import { Texture, TextureJSON } from './Texture';

type PhongMaterialOptions = {
  ambientColor: Color;
  diffuseColor: Color;
  specularColor: Color;
  shininess: number;
  diffuseMap?: Texture | null | undefined;
  specularMap?: Texture | null | undefined;
  displacementMap?: Texture | null | undefined;
  normalMap?: Texture | null | undefined;
  ambientCoef?: number;
  specularCoef?: number;
  displacementCoef?: number;
};

export interface PhongMaterialJSON extends ShaderMaterialJSON {
  ambientColor: string;
  diffuseColor: string;
  specularColor: string;
  shininess: number;
  diffuseMap?: TextureJSON;
  specularMap?: TextureJSON;
  displacementMap?: TextureJSON;
  normalMap?: TextureJSON;
  ambientCoef?: number;
  specularCoef?: number;
  displacementCoef?: number;
}

export class PhongMaterial extends ShaderMaterial {
  private _ambientColor: Color;
  private _diffuseColor: Color;
  private _specularColor: Color;
  private _shininess: number;
  private _diffuseMap?: Texture | null | undefined;
  private _specularMap?: Texture | null | undefined;
  private _displacementMap?: Texture | null | undefined;
  private _normalMap?: Texture | null | undefined;
  private _ambientCoef: number;
  private _specularCoef: number;
  private _displacementCoef: number;

  constructor(options: PhongMaterialOptions) {
    const {
      ambientColor,
      diffuseColor,
      specularColor,
      shininess,
      diffuseMap,
      specularMap,
      displacementMap,
      normalMap,
      ambientCoef = 0.9,
      specularCoef = 0.9,
      displacementCoef = 0.0
    } = options;

    super({
      vertexShader: phongVertexShaderSource,
      fragmentShader: phongFragmentShaderSource,
      uniforms: {
        ambientColor: ambientColor.toArray(),
        diffuseColor: diffuseColor.toArray(),
        specularColor: specularColor.toArray(),
        shininess: shininess,
        diffuseMap: diffuseMap || null,
        specularMap: specularMap || null,
        displacementMap: displacementMap || null,
        normalMap: normalMap || null,
        useDiffuseMap: !!diffuseMap,
        useSpecularMap: !!specularMap,
        useDisplacementMap: !!displacementMap,
        useNormalMap: !!normalMap,
        ambientCoef: ambientCoef,
        specularCoef: specularCoef,
        displacementCoef: displacementCoef,
      },
    });

    this._ambientColor = ambientColor;
    this._diffuseColor = diffuseColor;
    this._specularColor = specularColor;
    this._shininess = shininess;
    this._diffuseMap = diffuseMap;
    this._specularMap = specularMap;
    this._displacementMap = displacementMap;
    this._normalMap = normalMap;
    this._ambientCoef = ambientCoef;
    this._specularCoef = specularCoef;
    this._displacementCoef = displacementCoef;
  }

  get ambientColor() {
    return this._ambientColor;
  }

  set ambientColor(color: Color) {
    this._ambientColor = color;
  }

  get diffuseColor() {
    return this._diffuseColor;
  }

  set diffuseColor(color: Color) {
    this._diffuseColor = color;
  }

  get specularColor() {
    return this._specularColor;
  }

  set specularColor(color: Color) {
    this._specularColor = color;
  }

  get shininess() {
    return this._shininess;
  }

  set shininess(value: number) {
    this._shininess = value;
  }

  get diffuseMap(): Texture | null | undefined {
    return this._diffuseMap;
  }

  set diffuseMap(texture: Texture | null | undefined) {
    this._diffuseMap = texture;
  }

  get specularMap(): Texture | null | undefined {
    return this._specularMap;
  }

  set specularMap(texture: Texture | null | undefined) {
    this._specularMap = texture;
  }

  get displacementMap(): Texture | null | undefined {
    return this._displacementMap;
  }

  set displacementMap(texture: Texture | null | undefined) {
    this._displacementMap = texture;
  }

  get normalMap(): Texture | null | undefined {
    return this._normalMap;
  }

  set normalMap(texture: Texture | null | undefined) {
    this._normalMap = texture;
  }

  get ambientCoef() {
    return this._ambientCoef;
  }

  set ambientCoef(value: number) {
    this._ambientCoef = value;
  }

  get specularCoef() {
    return this._specularCoef;
  }

  set specularCoef(value: number) {
    this._specularCoef = value;
  }

  get displacementCoef() {
    return this._displacementCoef;
  }

  set displacementCoef(value: number) {
    this._displacementCoef = value;
  }

  to_json(): PhongMaterialJSON {
    const baseJson = super.to_json();
    return {
      ...baseJson,
      ambientColor: this._ambientColor.to_json(),
      diffuseColor: this._diffuseColor.to_json(),
      specularColor: this._specularColor.to_json(),
      shininess: this._shininess,
      diffuseMap: this._diffuseMap ? this._diffuseMap.to_json() : undefined,
      specularMap: this._specularMap ? this._specularMap.to_json() : undefined,
      displacementMap: this._displacementMap ? this._displacementMap.to_json() : undefined,
      normalMap: this._normalMap ? this._normalMap.to_json() : undefined,
      ambientCoef: this._ambientCoef,
      specularCoef: this._specularCoef,
      displacementCoef: this._displacementCoef,
    };
  }

  static from_json(json: PhongMaterialJSON): PhongMaterial {
    const uniforms: UniformSet = {};
    for (const key in json.uniforms) {
      uniforms[key] = json.uniforms[key];
    }
    const ambientColor = Color.from_json(json.ambientColor);
    const diffuseColor = Color.from_json(json.diffuseColor);
    const specularColor = Color.from_json(json.specularColor);
    const shininess = json.shininess;
    const diffuseMap = json.diffuseMap ? Texture.from_json(json.diffuseMap) : undefined;
    const specularMap = json.specularMap ? Texture.from_json(json.specularMap) : undefined;
    const displacementMap = json.displacementMap ? Texture.from_json(json.displacementMap) : undefined;
    const normalMap = json.normalMap ? Texture.from_json(json.normalMap) : undefined;
    const ambientCoef = json.ambientCoef ?? 0.9;
    const specularCoef = json.specularCoef ?? 0.9;
    const displacementCoef = json.displacementCoef ?? 0.0;

    return new PhongMaterial({
      ambientColor,
      diffuseColor,
      specularColor,
      shininess,
      diffuseMap,
      specularMap,
      displacementMap,
      normalMap,
      ambientCoef,
      specularCoef,
      displacementCoef,
    });
  }
}
