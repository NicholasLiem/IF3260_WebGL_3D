import React, { useRef } from 'react';
import { Button } from '@mui/material';
import toast from 'react-hot-toast';
import Node from '@/webgl/Impl/Engine/Node';
import AnimationRunner from '@/webgl/Impl/Animation/AnimationRunner';
import Mesh from '@/webgl/Impl/Mesh/Mesh';
import Camera from '@/webgl/Impl/Engine/Camera';

interface FileOperationsProps {
  selectedNode: Node | null;
  rootNode: Node;
  updateNode: (node: Node) => void;
  animationRunner: AnimationRunner | null;
}

const FileOperations: React.FC<FileOperationsProps> = ({
  selectedNode,
  rootNode,
  updateNode,
  animationRunner,
}) => {
  const inputFile = useRef<HTMLInputElement | null>(null);

  const handleSaveToJson = () => {
    if (!selectedNode) return;
    const selectedNodeJson = JSON.stringify(selectedNode.to_json());
    const blob = new Blob([selectedNodeJson], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'component.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast.success('Successfully save component to json');
  };

  const handleLoadFromJson = async (file: File | null) => {
    if (!file || !selectedNode) return;
    if (!(selectedNode instanceof Mesh) && selectedNode !== rootNode) {
      toast.error('Can not load component if not a mesh object');
      return;
    }

    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const newNode = await Node.from_json(json);

      if (newNode instanceof Camera && selectedNode instanceof Mesh) {
        toast.error('Can not load camera inside a mesh object');
        return;
      }

      selectedNode.addChild(newNode);
      updateNode(selectedNode);

      toast.success('Loaded');
      animationRunner?.refreshBindNode();
    } catch (e) {
      toast.error('Error loading file');
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={handleSaveToJson}
        style={{ marginRight: '10px' }}
      >
        Save to JSON
      </Button>
      <Button
        onClick={() => inputFile.current?.click()}
        variant="contained"
      >
        Load from JSON
      </Button>
      <input
        type="file"
        id="file"
        ref={inputFile}
        style={{ display: 'none' }}
        onChange={(e) => handleLoadFromJson(e.target.files?.[0] ?? null)}
      />
    </div>
  );
};

export default FileOperations;
