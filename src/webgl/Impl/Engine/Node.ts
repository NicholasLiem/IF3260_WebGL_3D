import NodeInterface from '@/webgl/Interfaces/Engine/NodeInterface';
import Vector3, { Vector3JSON } from '../Type/Math/Vector3';
import Quaternion from '@/webgl/Impl/Type/Quarternion';
import { Mat4, Mat4JSON } from '../Type/Math/Mat4';

export interface NodeJSON {
  id: number;
  name: string;
  parentId?: number | null;
  children: NodeJSON[];
  nodeType: string;
  localMatrix: Mat4JSON;
  worldMatrix: Mat4JSON;
  translation: Vector3JSON;
  rotation: Vector3JSON;
  scale: Vector3JSON;
}

const usedIds = new Set<number>();

function generateUniqueId(): number {
  let newId = Math.floor(Math.random() * 10000);
  while (usedIds.has(newId)) {
    newId = Math.floor(Math.random() * 10000);
  }
  usedIds.add(newId);
  return newId;
}

class Node implements NodeInterface {
  id: number;
  public name: string;
  children: Node[] = [];
  parent: Node | null = null;
  localMatrix: Mat4;
  worldMatrix: Mat4;
  protected _translation: Vector3;
  protected _rotation: Vector3;
  protected _quaternion: Quaternion;
  protected _scale: Vector3;

  get translation(): Vector3 {
    return this._translation;
  }

  set translation(position: Vector3) {
    this._translation = position;
    this.updateLocalMatrix();
  }

  get rotation(): Vector3 {
    return this._rotation;
  }

  set rotation(rotation: Vector3) {
    this._rotation = rotation;
    this._quaternion = Quaternion.fromEuler(rotation);
    this.updateLocalMatrix();
  }

  get quaternion(): Quaternion {
    return this._quaternion;
  }

  set quaternion(quaternion: Quaternion) {
    this._quaternion = quaternion;
    this._rotation = quaternion.toEuler();
    this.updateLocalMatrix();
  }

  get scale(): Vector3 {
    return this._scale;
  }

  set scale(scale: Vector3) {
    this._scale = scale;
    this.updateLocalMatrix();
  }

  constructor(
    id: number,
    name: string,
    translation = new Vector3(0, 0, 0),
    rotation = new Vector3(0, 0, 0),
    scale = new Vector3(1, 1, 1),
    localMatrix: Mat4 = new Mat4(),
    worldMatrix: Mat4 = new Mat4(),
    parent: Node | null = null,
  ) {
    this.id = !usedIds.has(id) ? id : generateUniqueId();
    usedIds.add(this.id);
    this.name = name;
    this._translation = translation;
    this._rotation = rotation;
    this._quaternion = Quaternion.fromEuler(rotation);
    this._scale = scale;
    this.localMatrix = localMatrix;
    this.worldMatrix = worldMatrix;
    this.parent = parent;
    this.updateLocalMatrix();
  }

  public findNodeById(id: number): Node | undefined {
    if (this.id === id) {
      return this;
    }
    for (let i = 0; i < this.children.length; i++) {
      const result = this.children[i].findNodeById(id);
      if (result) {
        return result;
      }
    }
    return undefined;
  }

  public findNodeByName(name: string): Node | undefined {
    if (this.name === name) {
      return this;
    }
    for (let i = 0; i < this.children.length; i++) {
      const result = this.children[i].findNodeByName(name);
      if (result) {
        return result;
      }
    }
    return undefined;
  }

  public setParent(parent: Node | null): void {
    if (this.parent) {
      const index = this.parent.children.indexOf(this);
      if (index !== -1) {
        this.parent.children.splice(index, 1);
      }
    }
    this.parent = parent;
    if (parent) {
      parent.children.push(this);
    }
    this.updateWorldMatrix();
  }

  public addChild(child: Node): void {
    child.setParent(this);
  }

  public updateWorldMatrix(): void {
    if (this.parent) {
      Mat4.multiply(
        this.worldMatrix.elements,
        this.localMatrix.elements,
        this.parent.worldMatrix.elements,
      );
    } else {
      this.worldMatrix.elements = new Float32Array(this.localMatrix.elements);
    }
    for (const child of this.children) {
      child.updateWorldMatrix();
    }
  }

  public updateLocalMatrix(): void {
    let res: Mat4;

    this.localMatrix = new Mat4();
    Mat4.scale(
      this.localMatrix.elements,
      this.localMatrix.elements,
      new Float32Array([this.scale.x, this.scale.y, this.scale.z]),
    );

    const rotationMatrix = new Mat4();
    Mat4.fromQuaternion(rotationMatrix.elements, this.quaternion);
    res = new Mat4();
    Mat4.multiply(
      res.elements,
      this.localMatrix.elements,
      rotationMatrix.elements,
    );
    this.localMatrix = res;

    res = new Mat4();
    Mat4.multiply(
      res.elements,
      this.localMatrix.elements,
      Mat4.translationMatrix(this.translation),
    );
    this.localMatrix = res;

    this.updateWorldMatrix();
  }

  traverse(callback: (node: Node) => void) {
    callback(this);
    for (const child of this.children) {
      child.traverse(callback);
    }
  }

  public removeChild(child: Node): void {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
      child.parent = null;
      this.updateWorldMatrix();
    }
  }

  public findChildByName(name: string): Node | null {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].name === name) {
          return this.children[i];
      }
    }
    return null;
  }

  to_json(): NodeJSON {
    return {
      id: this.id,
      name: this.name,
      children: this.children.map((child) => child.to_json()),
      parentId: this.parent ? this.parent.id : null,
      nodeType: this.constructor.name,
      localMatrix: this.localMatrix.to_json(),
      worldMatrix: this.worldMatrix.to_json(),
      translation: this.translation.to_json(),
      rotation: this.rotation.to_json(),
      scale: this.scale.to_json(),
    };
  }

  static async from_json(
    json: NodeJSON,
    nodesMap: Map<number, Node> = new Map(),
  ): Promise<Node> {
    const translation = Vector3.from_json(json.translation);
    const rotation = Vector3.from_json(json.rotation);
    const scale = Vector3.from_json(json.scale);
    const localMatrix = Mat4.from_json(json.localMatrix);
    const worldMatrix = Mat4.from_json(json.worldMatrix);

    let node: Node;

    switch (json.nodeType) {
      case 'Camera':
        const { default: Camera } = await import('./Camera');
        node = await Camera.from_json(json as any);
        break;
      case 'Mesh':
        const { default: Mesh } = await import('../Mesh/Mesh');
        node = await Mesh.from_json(json as any);
        break;
      case 'AmbientLight':
        const { default: AmbientLight } = await import('../Light/AmbientLight');
        node = await AmbientLight.from_json(json as any);
        break;
      case 'DirectionalLight':
        const { default: DirectionalLight } = await import('../Light/DirectionalLight');
        node = await DirectionalLight.from_json(json as any);
        break;
      default:
        node = new Node(
          json.id,
          json.name,
          translation,
          rotation,
          scale,
          localMatrix,
          worldMatrix,
          null,
        );
    }

    nodesMap.set(node.id, node);

    for (const childJson of json.children) {
      const childNode = await Node.from_json(childJson, nodesMap);
      childNode.setParent(node);
    }

    return node;
  }

  static async resolve_parents(
    rootNode: Node,
    nodesMap: Map<number, Node>,
  ): Promise<void> {
    nodesMap.forEach((node) => {
      if (node.parent === null && node !== rootNode) {
        const parentId = node.to_json().parentId;
        if (parentId !== null && parentId !== undefined) {
          const parent = nodesMap.get(parentId);
          if (parent) {
            node.setParent(parent);
          }
        }
      }
    });
  }

  static resolve_ids(rootNode: Node): void {
    const traverseAndResolve = (node: Node) => {
      if (usedIds.has(node.id)) {
        node.id = generateUniqueId();
      } else {
        usedIds.add(node.id);
      }

      for (const child of node.children) {
        traverseAndResolve(child);
      }
    };

    traverseAndResolve(rootNode);
  }

  clone(): Node {
    const clonedNode = new Node(
      this.id,
      this.name,
      this.translation.clone(),
      this.rotation.clone(),
      this.scale.clone(),
      this.localMatrix.clone(),
      this.worldMatrix.clone(),
      null,
    );

    this.children.forEach((child) => {
      const clonedChild = child.clone();
      clonedNode.children.push(clonedChild);
      clonedChild.setParent(clonedNode);
    });

    return clonedNode;
  }

  replaceFrom(node: Node): void {
    this.name = node.name;
    this.translation = node.translation.clone();
    this.rotation = node.rotation.clone();
    this.scale = node.scale.clone();
    this.localMatrix = node.localMatrix.clone();
    this.worldMatrix = node.worldMatrix.clone();
  }
}

export default Node;
