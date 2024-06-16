import { PhongMaterial } from '@/webgl/Impl/Material/PhongMaterial';
import Color from '@/webgl/Impl/Type/Color';
import { Texture } from '@/webgl/Impl/Material/Texture';

export const loadTexture = (src: string): Texture => {
  const texture = new Texture();
  const image = new Image();
  image.src = src;
  image.onload = () => {
    texture.setData(image);
  };
  return texture;
};

export const createPhongMaterial = (
  ambientColorHex: number,
  diffuseColorHex: number,
  specularColorHex: number,
  shininess: number,
  diffuseMapSrc: string,
  normalMapSrc: string,
  displacementMapSrc: string,
  specularMapSrc: string,
): PhongMaterial => {
  const ambientColor = Color.fromHex(ambientColorHex);
  const diffuseColor = Color.fromHex(diffuseColorHex);
  const specularColor = Color.fromHex(specularColorHex);

  const diffuseMap = loadTexture(diffuseMapSrc);
  const normalMap = loadTexture(normalMapSrc);
  const displacementMap = loadTexture(displacementMapSrc);
  const specularMap = loadTexture(specularMapSrc);

  return new PhongMaterial({
    ambientColor,
    diffuseColor,
    specularColor,
    shininess,
    diffuseMap,
    specularMap,
    normalMap,
    displacementMap,
  });
};
