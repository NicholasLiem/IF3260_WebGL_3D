import React from 'react';
import Vector3 from '@/webgl/Impl/Type/Math/Vector3';
import { SliderControl } from '../ComponentProperties';
import PointLight from '@/webgl/Impl/Light/PointLight';

interface PointlLightPropertiesProps {
  selectedNode: PointLight;
  radius: number;
  setRadius: (radius: number) => void;
  updateNode: (node: PointLight) => void;
}

const PointLightProperties: React.FC<PointlLightPropertiesProps> = ({
  selectedNode,
  radius,
  setRadius,
  updateNode,
}) => {

const handleRadiusChange = (value: number) => {
    selectedNode.radius = value;
    setRadius(value);
    updateNode(selectedNode);
    };


  return (
    <>
      <SliderControl
        label="Radius"
        value={radius}
        onChange={(val: number) => handleRadiusChange(val)}
        min={0}
        max={50}
        step={1}
      />
    </>
  );
};

export default PointLightProperties;