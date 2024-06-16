import SceneInterface from '@/webgl/Interfaces/Engine/SceneInterface';
import Camera from '../Engine/Camera';
import Node, { NodeJSON } from '../Engine/Node';
import Light from '@/webgl/Impl/Light/Light';

export interface SceneJSON {
  root: NodeJSON;
}

class Scene implements SceneInterface {
  public root: Node;

  constructor(root: Node) {
    this.root = root;
  }

  public getRoot() {
    return this.root;
  }
  
  // getNodeFromPath("kepala.badan.tangan")
  getNodeFromPath(path: string): Node | null {
    const pathParts = path.split('.');
    let currentNode : Node | null = this.root;
    for (let i = 0; i < pathParts.length && currentNode; i++) {
        currentNode = currentNode.findChildByName(pathParts[i]);
    }
    if (!currentNode) {
        console.error("Node not found");
    }
    return currentNode;
  }

  getCamera(): Camera | null {
    let camera: Camera | null = null;
    this.root.traverse((node: Node) => {
      if (
        (node as Camera).radius !== undefined &&
        (node as Camera).radius !== null
      ) {
        camera = node as Camera;
      }
    });
    return camera;
  }

  // getLight
  getLight(): Light | null {
    let light: Light | null = null;
    this.root.traverse((node: Node) => {
      if (
        node instanceof Light
      ){
        light = node as Light;
      }
    });
    return light;
  }
  to_json(): SceneJSON {
    return {
      root: this.root.to_json(),
    };
  }

  clone(): Scene {
    const clonedRoot = this.root.clone();
    return new Scene(clonedRoot);
  }

  static async from_json(json: any): Promise<Scene> {
    const rootNode = await Node.from_json(json.root);
    return new Scene(rootNode);
  }
}

export default Scene;
