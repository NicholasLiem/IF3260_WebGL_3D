import Light from '@/webgl/Impl/Light/Light';
import Color from '@/webgl/Impl/Type/Color';
import React, { useEffect, useState } from 'react';
import { SliderControl } from '../ComponentProperties';
import AmbientLight from '@/webgl/Impl/Light/AmbientLight';
import DirectionalLight from '@/webgl/Impl/Light/DirectionalLight';
import PointLight from '@/webgl/Impl/Light/PointLight';
import Vector3 from '@/webgl/Impl/Type/Math/Vector3';
import { Mat4 } from '@/webgl/Impl/Type/Math/Mat4';

interface LightPropertiesProps {
  selectedNode: Light;
  lightColor: Float32Array;
  setLightColor: (color: Float32Array) => void;
  intensity: number;
  setIntensity: (intensity: number) => void;
  updateNode: (node: Light) => void;
  onLightTypeChange: (newLight: Light) => void;
}

const LightProperties: React.FC<LightPropertiesProps> = ({
  selectedNode,
  lightColor,
  setLightColor,
  intensity,
  setIntensity,
  updateNode,
  onLightTypeChange,
}) => {
  const [lightType, setLightType] = useState<string>('Ambient');

  useEffect(() => {
    if (selectedNode instanceof AmbientLight) {
      setLightType('Ambient');
    } else if (selectedNode instanceof PointLight) {
      setLightType('Point');
    } else if (selectedNode instanceof DirectionalLight) {
      setLightType('Directional');
    }
  }, [selectedNode]);

  const handleLightTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = event.target.value;
    

    let newLight: Light;
    switch (selectedType) {
      case 'Ambient':
        newLight = new AmbientLight(selectedNode.id, "Ambient Light", new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(1, 1, 1), new Mat4(), new Mat4(), selectedNode.parent, selectedNode.color, 0.5);
        break;
      case 'Point':
        newLight = new PointLight(selectedNode.id, "Point Light", new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(1, 1, 1), new Mat4(), new Mat4(), selectedNode.parent, selectedNode.color, 0.5);
        break;
      case 'Directional':
        newLight = new DirectionalLight(selectedNode.id, "Directional Light", new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(1, 1, 1), new Mat4(), new Mat4(), selectedNode.parent, selectedNode.color, 0.5, new Vector3(0, 0, 0));
        break;
      default:
        newLight = new AmbientLight(selectedNode.id, "Ambient Light", new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(1, 1, 1), new Mat4(), new Mat4(), selectedNode.parent, selectedNode.color, 0.5);
        break;
    }
    
    newLight.setColor(new Color(lightColor[0], lightColor[1], lightColor[2], intensity));
    setLightType(selectedType);
    onLightTypeChange(newLight);
    updateNode(newLight);
  };
  const handleLightChange = (index: number, value: number) => {
    const updatedColorArray = lightColor.slice();
    updatedColorArray[index] = value;

    const updatedColor = new Color(
      updatedColorArray[0],
      updatedColorArray[1],
      updatedColorArray[2],
      updatedColorArray[3]
    );

    setLightColor(updatedColorArray);
    selectedNode.setColor(updatedColor);
    updateNode(selectedNode);
  };

  const handleIntensityChange = (value: number) => {
    handleLightChange(3, value);
    setIntensity(value);
  };

  return (
    <>
      <label>
        Light Type:
        <select value={lightType} onChange={handleLightTypeChange}>
          <option value="Ambient">Ambient Light</option>
          <option value="Point">Point Light</option>
          <option value="Directional">Directional Light</option>
        </select>
      </label>
      <SliderControl
        label="Light Color R"
        value={lightColor[0]}
        onChange={(val: number) => handleLightChange(0, val)}
        min={0}
        max={1}
        step={0.01}
      />
      <SliderControl
        label="Light Color G"
        value={lightColor[1]}
        onChange={(val: number) => handleLightChange(1, val)}
        min={0}
        max={1}
        step={0.01}
      />
      <SliderControl
        label="Light Color B"
        value={lightColor[2]}
        onChange={(val: number) => handleLightChange(2, val)}
        min={0}
        max={1}
        step={0.01}
      />
      <SliderControl
        label="Intensity"
        value={intensity}
        onChange={handleIntensityChange}
        min={0}
        max={1}
        step={0.01}
      />
    </>
  );
};

export default LightProperties;
