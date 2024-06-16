import React, { useEffect, useState } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Slider,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import Vector3 from '@/webgl/Impl/Type/Math/Vector3';
import Node from '@/webgl/Impl/Engine/Node';
import Mesh from '@/webgl/Impl/Mesh/Mesh';
import Light from "@/webgl/Impl/Light/Light";
import DirectionalLight from "@/webgl/Impl/Light/DirectionalLight";
import { useNode } from '@/app/context/NodeContext';
import Camera from '@/webgl/Impl/Engine/Camera';
import toast from 'react-hot-toast';
import AnimationRunner from '@/webgl/Impl/Animation/AnimationRunner';
import { PhongMaterial } from '@/webgl/Impl/Material/PhongMaterial';
import { BasicMaterial } from '@/webgl/Impl/Material/BasicMaterial';
import MaterialProperties from './ComponentProperties/MaterialProperties';
import LightProperties from './ComponentProperties/LightProperties';
import DirectionalLightProperties from './ComponentProperties/DirectionalLightProperties';
import FileOperations from './ComponentProperties/FileOperations';
import PointLight from '@/webgl/Impl/Light/PointLight';
import PointLightProperties from './ComponentProperties/PointLightProperties';

interface ComponentPropertiesProps {
  animationRunner: AnimationRunner | null;
  setName: (name: string) => void;
  setCamera: (camera: Camera) => void;
  setLight: (light: Light) => void;
}

export default function ComponentProperties({
  animationRunner,
  setName,
  setCamera,
  setLight,
}: ComponentPropertiesProps) {
  const { selectedNode, rootNode, updateNode, nodeTypes, updateLight } = useNode();

  const [positions, setPositions] = useState<Vector3>(
    selectedNode?.translation || new Vector3(),
  );
  const [rotations, setRotations] = useState<Vector3>(
    selectedNode?.rotation || new Vector3(),
  );
  const [scales, setScales] = useState<Vector3>(
    selectedNode?.scale || new Vector3(1, 1, 1),
  );
  const [selectedNodeType, setSelectedNodeType] = useState<Node | null>(null);

  const [texture, setTexture] = useState<string>('');
  const [materialType, setMaterialType] = useState<string>('');

  const [lightColor, setLightColor] = useState<Float32Array>(
    selectedNode instanceof Light ? new Float32Array(selectedNode.color.toArray()) : new Float32Array([1.0, 1.0, 1.0, 1.0]),
  );
  const [intensity, setIntensity] = useState<number>(
    selectedNode instanceof Light ? selectedNode.intensity : 1.0,
  );

  const [radius, setRadius] = useState<number>(
    selectedNode instanceof PointLight ? selectedNode.radius : 0.0,
  )

  const [direction, setDirection] = useState<Vector3>(
    selectedNode instanceof DirectionalLight
      ? selectedNode.direction
      : new Vector3(0, 0, -1)
  );
  const [useVertexColor, setUseVertexColor] = useState<boolean>(false);

  useEffect(() => {
    if (selectedNode) {
      setPositions(selectedNode.translation || new Vector3());
      setRotations(selectedNode.rotation || new Vector3());
      setScales(selectedNode.scale || new Vector3(1, 1, 1));
    }

    if (selectedNode instanceof Camera) {
      setCamera(selectedNode as Camera);
    }

    if (selectedNode instanceof Light) {
      setLight(selectedNode as Light);
    }

    if (selectedNode instanceof Mesh && selectedNode.material instanceof PhongMaterial) {
      setMaterialType("PhongMaterial");
      setTexture('');
    }

    if (selectedNode instanceof Mesh && selectedNode.material instanceof BasicMaterial) {
      setMaterialType("BasicMaterial");
      setTexture('');
    }

  }, [selectedNode, setCamera, setLight]);

  const handleVector3Change = (
    setter: React.Dispatch<React.SetStateAction<Vector3>>,
    updater: (node: Node, value: Vector3) => void,
    axis: 'x' | 'y' | 'z',
    value: number
  ) => {
    if (selectedNode && selectedNode !== rootNode) {
      const updatedVector = setter === setPositions
        ? new Vector3(positions.getX(), positions.getY(), positions.getZ())
        : setter === setRotations
          ? new Vector3(rotations.getX(), rotations.getY(), rotations.getZ())
          : new Vector3(scales.getX(), scales.getY(), scales.getZ());

      updatedVector[axis] = value;
      setter(updatedVector);
      updater(selectedNode, updatedVector);
      updateNode(selectedNode);
    }
  };

  const handleAddNode = () => {
    if (
      selectedNode &&
      selectedNodeType &&
      selectedNode.constructor.name !== 'Node' &&
      selectedNodeType.constructor.name === 'Camera'
    ) {
      toast.error('Can only create camera under scene!');
      return;
    }

    if (selectedNode && selectedNodeType) {
      selectedNode.addChild(selectedNodeType);
      updateNode(selectedNode);
      animationRunner?.refreshBindNode();
    }

    setSelectedNodeType(null);
  };
  const handleLightTypeChange = (newLight: Light) => {

    if (selectedNode) {

      const parent = selectedNode.parent;
      if (parent) {

        parent.removeChild(selectedNode);

        parent.addChild(newLight);

        setLight(newLight);
        updateNode(selectedNode);
        updateLight(newLight);
      }
    }
  };
  const handleUseVertexColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedNode instanceof Mesh) {
      selectedNode.useVertexColor = event.target.checked;
      setUseVertexColor(event.target.checked);
      updateNode(selectedNode);
    }
  };

  return (
    <div className="pt-3 pl-3">
      {selectedNode ? (
        <>
          <TextField
            label="Name"
            value={selectedNode.name}
            onChange={(e) => {
              selectedNode.name = e.target.value;
              setName(e.target.value);
              updateNode(selectedNode);
              animationRunner?.refreshBindNode();
            }}
            disabled={selectedNode === rootNode}
          />
          {selectedNode instanceof Mesh && (
            <>
              <SliderControl
                label="Position X"
                value={positions.getX()}
                onChange={(val) => handleVector3Change(setPositions, (node, value) => node.translation = value, 'x', val)}
                min={-100}
                max={100}
                step={0.01}
              />
              <SliderControl
                label="Position Y"
                value={positions.getY()}
                onChange={(val) => handleVector3Change(setPositions, (node, value) => node.translation = value, 'y', val)}
                min={-100}
                max={100}
                step={0.01}
              />
              <SliderControl
                label="Position Z"
                value={positions.getZ()}
                onChange={(val) => handleVector3Change(setPositions, (node, value) => node.translation = value, 'z', val)}
                min={-100}
                max={100}
                step={0.01}
              />
              <SliderControl
                label="Rotation X"
                value={rotations.getX()}
                onChange={(val) => handleVector3Change(setRotations, (node, value) => node.rotation = value, 'x', val)}
                min={0}
                max={360}
                step={0.01}
              />
              <SliderControl
                label="Rotation Y"
                value={rotations.getY()}
                onChange={(val) => handleVector3Change(setRotations, (node, value) => node.rotation = value, 'y', val)}
                min={0}
                max={360}
                step={0.01}
              />
              <SliderControl
                label="Rotation Z"
                value={rotations.getZ()}
                onChange={(val) => handleVector3Change(setRotations, (node, value) => node.rotation = value, 'z', val)}
                min={0}
                max={360}
                step={0.01}
              />
              <SliderControl
                label="Scale X"
                value={scales.getX()}
                onChange={(val) => handleVector3Change(setScales, (node, value) => node.scale = value, 'x', val)}
                min={-10}
                max={10}
              />
              <SliderControl
                label="Scale Y"
                value={scales.getY()}
                onChange={(val) => handleVector3Change(setScales, (node, value) => node.scale = value, 'y', val)}
                min={-10}
                max={10}
              />
              <SliderControl
                label="Scale Z"
                value={scales.getZ()}
                onChange={(val) => handleVector3Change(setScales, (node, value) => node.scale = value, 'z', val)}
                min={-10}
                max={10}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={useVertexColor}
                    onChange={handleUseVertexColorChange}
                  />
                }
                label="Use Vertex Color"
              />
              <MaterialProperties
                selectedNode={selectedNode as Mesh}
                texture={texture}
                setTexture={setTexture}
                materialType={materialType}
                setMaterialType={setMaterialType}
                updateNode={updateNode}
              />
            </>
          )}

          {selectedNode instanceof Light && (
            <LightProperties
              selectedNode={selectedNode as Light}
              lightColor={lightColor}
              setLightColor={setLightColor}
              intensity={intensity}
              setIntensity={setIntensity}
              updateNode={updateNode}
              onLightTypeChange={handleLightTypeChange}
            />
          )}

          {selectedNode instanceof DirectionalLight && (
            <DirectionalLightProperties
              selectedNode={selectedNode as DirectionalLight}
              direction={direction}
              setDirection={setDirection}
              updateNode={updateNode}
            />
          )}

          {selectedNode instanceof PointLight && (
            <PointLightProperties
              selectedNode={selectedNode as PointLight}
              radius={radius}
              setRadius={setRadius}
              updateNode={updateNode}
            />
          )}

          <FileOperations
            selectedNode={selectedNode}
            rootNode={rootNode!}
            updateNode={updateNode}
            animationRunner={animationRunner}
          />

          {(selectedNode === rootNode || selectedNode instanceof Mesh) && (
            <>
              <FormControl fullWidth margin="normal">
                <InputLabel>Node Type</InputLabel>
                <Select
                  value={
                    selectedNodeType ? selectedNodeType.constructor.name : ''
                  }
                  onChange={(e) => {
                    const selectedType = nodeTypes.find(
                      (type) => type.label === e.target.value,
                    );
                    if (selectedType) {
                      setSelectedNodeType(
                        Object.assign(
                          Object.create(
                            Object.getPrototypeOf(selectedType.instance),
                          ),
                          selectedType.instance,
                        ),
                      );
                    }
                  }}
                  label="Node Type"
                >
                  {nodeTypes.map((type) => (
                    <MenuItem key={type.label} value={type.label}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button variant="contained" onClick={handleAddNode}>
                Add Node
              </Button>
            </>
          )}
        </>
      ) : (
        <p>No properties to display</p>
      )}
    </div>
  );
}

export interface SliderControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
}

export function SliderControl({
  label,
  value,
  onChange,
  min,
  max,
  step = 0.1,
}: SliderControlProps) {
  return (
    <>
      <p>{label}</p>
      <Slider
        value={value}
        onChange={(_, newValue) => {
          if (typeof newValue === 'number') {
            onChange(newValue);
          }
        }}
        min={min}
        max={max}
        step={step}
        valueLabelDisplay="auto"
        size="small"
      />
    </>
  );
}
