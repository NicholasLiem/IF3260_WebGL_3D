import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { PhongMaterial } from '@/webgl/Impl/Material/PhongMaterial';
import { BasicMaterial } from '@/webgl/Impl/Material/BasicMaterial';
import { Texture, WrapMode, MinFilter } from '@/webgl/Impl/Material/Texture';
import Color from '@/webgl/Impl/Type/Color';
import { SliderControl } from '../ComponentProperties';
import Mesh from '@/webgl/Impl/Mesh/Mesh';

const texturePaths: { [key: string]: { diffuse: string, normal?: string, displacement?: string, specular?: string } } = {
  "kayu": { diffuse: "images/Other/Kayu/kayu.jpg", normal: "images/Other/Kayu/KayuNormalMap.png", displacement: "images/Other/Kayu/KayuDisplacementMap.png" },
  "batu": { diffuse: "images/Other/Batu/batu.jpg", normal: "images/Other/Batu/BatuNormalMap.png", displacement: "images/Other/Batu/BatuDisplacementMap.png" },
  "dunia": { diffuse: "images/Earth/world.jpg", normal: "images/Earth/NormalMap.png", displacement: "images/Earth/DisplacementMap.png", specular: 'images/Earth/EarthSpecularMap.png' },
  "merkuri": { diffuse: "images/Mercury/Mercury.jpg", normal: "images/Mercury/MercuryNormal.png", displacement: "images/Mercury/MercuryDisplacement.png" },
  "jupiter": { diffuse: "images/Jupyter/Jupyter.jpg", normal: "images/Jupyter/JupyterNormalMap.png", displacement: "images/Jupyter/JupyterDisplacementMap.png" },
  "venus": { diffuse: "images/Venus/Venus.jpg", normal: "images/Venus/VenusNormalMap.png", displacement: "images/Venus/VenusDisplacementMap.png" },
  "peta": { diffuse: "images/Other/Plane/Peta.jpg", normal: "images/Other/Plane/PetaNormalMap.png", displacement: "images/Other/Plane/PetaDisplacementMap.png", specular: "images/Other/Peta/PetaSpecularMap.png" }
};

interface MaterialPropertiesProps {
  selectedNode: Mesh;
  texture: string;
  setTexture: (texture: string) => void;
  materialType: string;
  setMaterialType: (type: string) => void;
  updateNode: (node: Mesh) => void;
}

const MaterialProperties: React.FC<MaterialPropertiesProps> = ({
  selectedNode,
  texture,
  setTexture,
  materialType,
  setMaterialType,
  updateNode,
}) => {
  const [ambientColor, setAmbientColor] = useState<Float32Array>(
    selectedNode.material instanceof PhongMaterial
      ? new Float32Array(selectedNode.material.ambientColor.toArray())
      : new Float32Array([0.1, 0.1, 0.1])
  );
  const [ambientStrength, setAmbientStrength] = useState<number>(
    selectedNode.material instanceof PhongMaterial ? selectedNode.material.ambientCoef : 0.9
  );
  const [diffuseColor, setDiffuseColor] = useState<Float32Array>(
    selectedNode.material instanceof PhongMaterial
      ? new Float32Array(selectedNode.material.diffuseColor.toArray())
      : new Float32Array([0.8, 0.8, 0.8])
  );
  const [specularColor, setSpecularColor] = useState<Float32Array>(
    selectedNode.material instanceof PhongMaterial
      ? new Float32Array(selectedNode.material.specularColor.toArray())
      : new Float32Array([1.0, 1.0, 1.0])
  );
  const [specularStrength, setSpecularStrength] = useState<number>(
    selectedNode.material instanceof PhongMaterial ? selectedNode.material.specularCoef : 1
  );
  const [shininess, setShininess] = useState<number>(
    selectedNode.material instanceof PhongMaterial ? selectedNode.material.shininess : 1
  );
  const [displacement, setDisplacement] = useState<number>(
    selectedNode.material instanceof PhongMaterial &&
    selectedNode.material.displacementMap != null
      ? selectedNode.material.displacementCoef
      : 0.1
  );
  const [basicColor, setBasicColor] = useState<Float32Array>(
    selectedNode.material instanceof BasicMaterial
      ? new Float32Array(selectedNode.material.color.toArray())
      : new Float32Array([1.0, 1.0, 1.0])
  );

  useEffect(() => {
    if (selectedNode.material instanceof PhongMaterial) {
      setAmbientColor(new Float32Array(selectedNode.material.ambientColor.toArray()));
      setAmbientStrength(selectedNode.material.ambientCoef);
      setDiffuseColor(new Float32Array(selectedNode.material.diffuseColor.toArray()));
      setSpecularColor(new Float32Array(selectedNode.material.specularColor.toArray()));
      setSpecularStrength(selectedNode.material.specularCoef);
      setShininess(selectedNode.material.shininess);
      setDisplacement(selectedNode.material.displacementCoef);
    }
  }, [selectedNode]);

  const handleTextureChange = (newTexture: string) => {
    if (selectedNode.material instanceof PhongMaterial) {
      const phongMaterial = selectedNode.material;
      const paths = texturePaths[newTexture];

      phongMaterial.diffuseMap = null;
      phongMaterial.displacementMap = null;
      phongMaterial.specularMap = null;
      phongMaterial.normalMap = null;
      updateNode(selectedNode);

      if (!paths) {
        return;
      } else {
        if (paths.diffuse) {
          const diffuseTexture = new Texture();
          const diffuseImage = new Image();
          diffuseImage.src = paths.diffuse;
          diffuseImage.onload = () => {
            diffuseTexture.setData(diffuseImage);
            diffuseTexture.wrapS = WrapMode.ClampToEdge;
            diffuseTexture.wrapT = WrapMode.ClampToEdge;
            diffuseTexture.minFilter = MinFilter.Linear;
            diffuseTexture.magFilter = MinFilter.Linear;
            phongMaterial.diffuseMap = diffuseTexture;
            updateNode(selectedNode);
          };
        }

        if (paths.normal) {
          const normalTexture = new Texture();
          const normalImage = new Image();
          normalImage.src = paths.normal;
          normalImage.onload = () => {
            normalTexture.setData(normalImage);
            normalTexture.wrapS = WrapMode.ClampToEdge;
            normalTexture.wrapT = WrapMode.ClampToEdge;
            normalTexture.minFilter = MinFilter.Linear;
            normalTexture.magFilter = MinFilter.Linear;
            phongMaterial.normalMap = normalTexture;
            updateNode(selectedNode);
          };
        }

        if (paths.displacement) {
          const displacementTexture = new Texture();
          const displacementImage = new Image();
          displacementImage.src = paths.displacement;
          displacementImage.onload = () => {
            displacementTexture.setData(displacementImage);
            displacementTexture.wrapS = WrapMode.ClampToEdge;
            displacementTexture.wrapT = WrapMode.ClampToEdge;
            displacementTexture.minFilter = MinFilter.Linear;
            displacementTexture.magFilter = MinFilter.Linear;
            phongMaterial.displacementMap = displacementTexture;
            updateNode(selectedNode);
          };
        }

        if (paths.specular) {
          const specularTexture = new Texture();
          const specularImage = new Image();
          specularImage.src = paths.specular;
          specularImage.onload = () => {
            specularTexture.setData(specularImage);
            specularTexture.wrapS = WrapMode.ClampToEdge;
            specularTexture.wrapT = WrapMode.ClampToEdge;
            specularTexture.minFilter = MinFilter.Linear;
            specularTexture.magFilter = MinFilter.Linear;
            phongMaterial.specularMap = specularTexture;
            updateNode(selectedNode);
          };
        }

      }

      setTexture(newTexture);
    }
  };

  const handleMaterialChange = (newMaterialType: string) => {
    if (selectedNode instanceof Mesh) {
      const newMaterial = newMaterialType === 'PhongMaterial'
        ? new PhongMaterial({
          ambientColor: new Color(0.1, 0.1, 0.1),
          diffuseColor: new Color(0.8, 0.8, 0.8),
          specularColor: new Color(1.0, 1.0, 1.0),
          shininess: 0.9,
          ambientCoef: 0.9,
          specularCoef: 1.0,
          displacementCoef: 0.1,
        })
        : new BasicMaterial();
      selectedNode.material = newMaterial;
      setMaterialType(newMaterialType);
      updateNode(selectedNode);
    }
  };

  const handleDisplacementFactor = (value: number) => {
    if (selectedNode.material instanceof PhongMaterial && selectedNode.material.displacementMap != null) {
      setDisplacement(value);
      selectedNode.material.displacementCoef = value;
      updateNode(selectedNode);
    }
  };

  const handleCoefChange = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    updater: (material: PhongMaterial, value: number) => void,
    value: number
  ) => {
    if (selectedNode.material instanceof PhongMaterial) {
      setter(value);
      updater(selectedNode.material, value);
      updateNode(selectedNode);
    }
  };

  const handleColorChange = (
    setter: React.Dispatch<React.SetStateAction<Float32Array>>,
    updater: (material: PhongMaterial, color: Color) => void,
    index: number,
    value: number
  ) => {
    if (selectedNode.material instanceof PhongMaterial) {
      const updatedColorArray = setter === setAmbientColor
        ? ambientColor.slice()
        : setter === setDiffuseColor
          ? diffuseColor.slice()
          : specularColor.slice();

      updatedColorArray[index] = value;

      const updatedColor = new Color(
        updatedColorArray[0],
        updatedColorArray[1],
        updatedColorArray[2],
      );

      setter(updatedColorArray);
      updater(selectedNode.material, updatedColor);
      updateNode(selectedNode);
    }
  };

  const handleBasicColorChange = (index: number, value: number) => {
    if (selectedNode.material instanceof BasicMaterial) {
      const updatedColorArray = basicColor.slice();
      updatedColorArray[index] = value;
      setBasicColor(updatedColorArray);

      selectedNode.material.color = new Color(updatedColorArray[0], updatedColorArray[1], updatedColorArray[2]);
      updateNode(selectedNode);
    }
  };

  return (
    <>
      <FormControl fullWidth margin="normal">
        <InputLabel>Material Type</InputLabel>
        <Select
          value={materialType}
          onChange={(e) => handleMaterialChange(e.target.value)}
          label="Material Type"
        >
          <MenuItem value="BasicMaterial">Basic Material</MenuItem>
          <MenuItem value="PhongMaterial">Phong Material</MenuItem>
        </Select>
      </FormControl>

      {selectedNode.material instanceof PhongMaterial && (
        <>
          <FormControl fullWidth margin="normal">
            <InputLabel>Texture</InputLabel>
            <Select
              value={texture}
              onChange={(e) => handleTextureChange(e.target.value)}
              label="Texture"
            >
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="kayu">Kayu</MenuItem>
              <MenuItem value="batu">Batu</MenuItem>
              <MenuItem value="dunia">Dunia</MenuItem>
              <MenuItem value="merkuri">Merkuri</MenuItem>
              <MenuItem value="jupiter">Jupiter</MenuItem>
              <MenuItem value="venus">Venus</MenuItem>
              <MenuItem value="peta">Peta</MenuItem>
            </Select>
          </FormControl>
          {selectedNode.material.displacementMap && (
            <SliderControl
              label="Displacement Factor"
              value={displacement}
              min={-1}
              max={1}
              step={0.01}
              onChange={handleDisplacementFactor}
            />
          )}
          <SliderControl
            label="Ambient Strength"
            value={ambientStrength}
            min={0}
            max={1}
            step={0.01}
            onChange={(val) => handleCoefChange(setAmbientStrength, (material, value) => material.ambientCoef = value, val)}
          />
          <SliderControl
            label="Ambient Color R"
            value={ambientColor[0]}
            onChange={(val: number) => handleColorChange(setAmbientColor, (material, color) => material.ambientColor = color, 0, val)}
            min={0}
            max={1}
            step={0.01}
          />
          <SliderControl
            label="Ambient Color G"
            value={ambientColor[1]}
            onChange={(val: number) => handleColorChange(setAmbientColor, (material, color) => material.ambientColor = color, 1, val)}
            min={0}
            max={1}
            step={0.01}
          />
          <SliderControl
            label="Ambient Color B"
            value={ambientColor[2]}
            onChange={(val: number) => handleColorChange(setAmbientColor, (material, color) => material.ambientColor = color, 2, val)}
            min={0}
            max={1}
            step={0.01}
          />
          <SliderControl
            label="Diffuse Color R"
            value={diffuseColor[0]}
            onChange={(val: number) => handleColorChange(setDiffuseColor, (material, color) => material.diffuseColor = color, 0, val)}
            min={0}
            max={1}
            step={0.01}
          />
          <SliderControl
            label="Diffuse Color G"
            value={diffuseColor[1]}
            onChange={(val: number) => handleColorChange(setDiffuseColor, (material, color) => material.diffuseColor = color, 1, val)}
            min={0}
            max={1}
            step={0.01}
          />
          <SliderControl
            label="Diffuse Color B"
            value={diffuseColor[2]}
            onChange={(val: number) => handleColorChange(setDiffuseColor, (material, color) => material.diffuseColor = color, 2, val)}
            min={0}
            max={1}
            step={0.01}
          />
          <SliderControl
            label="Specular Strength"
            value={specularStrength}
            min={0}
            max={1}
            step={0.01}
            onChange={(val) => handleCoefChange(setSpecularStrength, (material, value) => material.specularCoef = value, val)}
          />
          <SliderControl
            label="Specular Color R"
            value={specularColor[0]}
            onChange={(val: number) => handleColorChange(setSpecularColor, (material, color) => material.specularColor = color, 0, val)}
            min={0}
            max={1}
            step={0.01}
          />
          <SliderControl
            label="Specular Color G"
            value={specularColor[1]}
            onChange={(val: number) => handleColorChange(setSpecularColor, (material, color) => material.specularColor = color, 1, val)}
            min={0}
            max={1}
            step={0.01}
          />
          <SliderControl
            label="Specular Color B"
            value={specularColor[2]}
            onChange={(val: number) => handleColorChange(setSpecularColor, (material, color) => material.specularColor = color, 2, val)}
            min={0}
            max={1}
            step={0.01}
          />
          <SliderControl
            label="Shininess"
            value={shininess}
            min={0}
            max={100}
            step={1}
            onChange={setShininess}
          />
        </>
      )}

      {selectedNode.material instanceof BasicMaterial && (
        <>
          <SliderControl
            label="Color R"
            value={basicColor[0]}
            onChange={(val: number) => handleBasicColorChange(0, val)}
            min={0}
            max={1}
            step={0.01}
          />
          <SliderControl
            label="Color G"
            value={basicColor[1]}
            onChange={(val: number) => handleBasicColorChange(1, val)}
            min={0}
            max={1}
            step={0.01}
          />
          <SliderControl
            label="Color B"
            value={basicColor[2]}
            onChange={(val: number) => handleBasicColorChange(2, val)}
            min={0}
            max={1}
            step={0.01}
          />
        </>
      )}
    </>
  );
};

export default MaterialProperties;
