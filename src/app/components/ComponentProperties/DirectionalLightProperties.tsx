import React from 'react';
import Vector3 from '@/webgl/Impl/Type/Math/Vector3';
import DirectionalLight from '@/webgl/Impl/Light/DirectionalLight';
import { SliderControl } from '../ComponentProperties';

interface DirectionalLightPropertiesProps {
  selectedNode: DirectionalLight;
  direction: Vector3;
  setDirection: (direction: Vector3) => void;
  updateNode: (node: DirectionalLight) => void;
}

const DirectionalLightProperties: React.FC<DirectionalLightPropertiesProps> = ({
  selectedNode,
  direction,
  setDirection,
  updateNode,
}) => {
  const handleDirectionChange = (axis: 'x' | 'y' | 'z', value: number) => {
    const updatedDirection = new Vector3(
      direction.getX(),
      direction.getY(),
      direction.getZ()
    );
    updatedDirection[axis] = value;
    setDirection(updatedDirection);
    selectedNode.setDirection(updatedDirection);
    updateNode(selectedNode);
  };

  return (
    <>
      <SliderControl
        label="Direction X"
        value={direction.getX()}
        onChange={(val: number) => handleDirectionChange('x', val)}
        min={-1}
        max={1}
        step={0.01}
      />
      <SliderControl
        label="Direction Y"
        value={direction.getY()}
        onChange={(val: number) => handleDirectionChange('y', val)}
        min={-1}
        max={1}
        step={0.01}
      />
      <SliderControl
        label="Direction Z"
        value={direction.getZ()}
        onChange={(val: number) => handleDirectionChange('z', val)}
        min={-1}
        max={1}
        step={0.01}
      />
    </>
  );
};

export default DirectionalLightProperties;
