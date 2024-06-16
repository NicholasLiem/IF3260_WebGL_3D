import React, { createContext, useContext, useState, ReactNode } from 'react';
import Node from '@/webgl/Impl/Engine/Node';
import Mesh from '@/webgl/Impl/Mesh/Mesh';
import { BoxGeometry } from '@/webgl/Impl/Geometry/Objects/Solid/BoxGeometry';
import { BasicMaterial } from '@/webgl/Impl/Material/BasicMaterial';
import Color from '@/webgl/Impl/Type/Color';
import Camera from '@/webgl/Impl/Engine/Camera';
import { CameraType } from '@/webgl/Interfaces/Engine/CameraInterface';
import Point from '@/webgl/Impl/Type/Point';
import { SphereGeometry } from '@/webgl/Impl/Geometry/Objects/Solid/SphereGeometry';
import { PhongMaterial } from '@/webgl/Impl/Material/PhongMaterial';
import { createPhongMaterial } from './NodeContextUtils';
import { PlaneGeometry } from '@/webgl/Impl/Geometry/Objects/Solid/PlaneGeometry';
import Light from '@/webgl/Impl/Light/Light';


interface NodeType {
  label: string;
  instance: Node;
}

interface NodeContextType {
  selectedNode: Node | null;
  setSelectedNode: (node: Node | null) => void;
  updateNode: (updatedNode: Node) => void;
  nodeTypes: NodeType[];
  rootNode: Node | null;
  setRootNode: (node: Node) => void;
  triggerRender: number;
  removeNode: (id: number) => void;
  updateLight: (updatedLight: Light) => void;
}

const NodeContext = createContext<NodeContextType | undefined>(undefined);

export const NodeProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [rootNode, setRootNode] = useState<Node | null>(null);
  const [triggerRender, setTriggerRender] = useState(0);

  const updateNode = (updatedNode: Node) => {
    if (selectedNode && selectedNode.id === updatedNode.id) {
      setSelectedNode(updatedNode);
    } else if (rootNode && rootNode.id !== updatedNode.id) {
      setSelectedNode(null);
    }
    if (rootNode) {
      setRootNode(rootNode);
    }
    setTriggerRender((prev) => prev + 1);
  };

  const updateLight = (updatedLight : Light) => {
    if (selectedNode && selectedNode instanceof Light){
      setSelectedNode(updatedLight);

    }
    setTriggerRender((prev) => prev + 1);
  }

  const removeNode = (nodeId: number) => {
    const findAndRemoveNode = (node: Node, id: number): boolean => {
      const childIndex = node.children.findIndex((child) => child.id === id);
      if (childIndex !== -1) {
        node.removeChild(node.children[childIndex]);
        return true;
      }
      for (const child of node.children) {
        if (findAndRemoveNode(child, id)) {
          return true;
        }
      }
      return false;
    };

    if (rootNode) {
      findAndRemoveNode(rootNode, nodeId);
      setTriggerRender((prev) => prev + 1);
    }
  };

  const nodeTypes: NodeType[] = [
    {
      label: 'Mesh',
      instance: new Mesh(
        1,
        'New Box Mesh',
        new BoxGeometry(1, 1, 1),
        new BasicMaterial({ color: Color.fromHex(0x00fff0) }),
      ),
    },
    {
      label: 'Planet Merkuri',
      instance: new Mesh(
        2,
        'Merkuri',
        new SphereGeometry(2, 128, 76),
        createPhongMaterial(
          0x202020,
          0xbcdf00,
          0xffffff,
          0.1,
          '/images/Mercury/Mercury.jpg',
          '/images/Mercury/MercuryNormal.png',
          '/images/Mercury/MercuryDisplacement.png',
          '/images/Mercury/MercurySpecularMap.png'
        )
      ),
    },
    {
      label: 'Plane',
      instance: new Mesh(
        3,
        'Plane',
        new PlaneGeometry(10, 10, 100, 100),
        createPhongMaterial(
          0xffffff,
          0xffffff,
          0xffffff,
          0.1,
          '/images/Other/Plane/Peta.jpg',
          '/images/Other/Plane/PetaNormalMap.png',
          '/images/Other/Plane/PetaDisplacementMap.png',
          '/images/Other/Plane/PetaSpecularMap.png',
        )
      )
    },
    {
      label: 'Camera',
      instance: new Camera(
        3,
        'New Camera',
        5,
        0,
        new Point(0, 0, 0),
        CameraType.Perspective,
      ),
    },
  ];

  return (
    <NodeContext.Provider
      value={{
        selectedNode,
        setSelectedNode,
        updateNode,
        nodeTypes,
        rootNode,
        setRootNode,
        triggerRender,
        removeNode,
        updateLight
      }}
    >
      {children}
    </NodeContext.Provider>
  );
};

export const useNode = () => {
  const context = useContext(NodeContext);
  if (!context) {
    throw new Error('useNode must be used within a NodeProvider');
  }
  return context;
};
