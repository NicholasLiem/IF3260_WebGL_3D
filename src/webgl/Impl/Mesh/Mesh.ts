import MeshInterface from '@/webgl/Interfaces/Engine/MeshInterface';
import Node, { NodeJSON } from '../Engine/Node';
import { BufferGeometry, BufferGeometryJSON } from '../Geometry/BufferGeometry';
import { BasicMaterial, BasicMaterialJSON } from '../Material/BasicMaterial';
import { ShaderMaterial, ShaderMaterialJSON } from '../Material/ShaderMaterial';
import { Mat4 } from '../Type/Math/Mat4';
import Vector3 from '../Type/Math/Vector3';
import { PhongMaterial, PhongMaterialJSON } from '../Material/PhongMaterial';

export interface MeshJSON extends NodeJSON {
  geometry: BufferGeometryJSON | null;
  material: ShaderMaterialJSON | null;
  materialType: 'BasicMaterial' | 'PhongMaterial' | 'ShaderMaterial';
  useVertexColor?: boolean;
}

class Mesh extends Node implements MeshInterface {
  geometry: BufferGeometry;
  material: ShaderMaterial;
  useVertexColor: boolean;

  constructor(
    id: number,
    name: string,
    geometry: BufferGeometry,
    material: ShaderMaterial,
    translation = new Vector3(0, 0, 0),
    rotation = new Vector3(0, 0, 0),
    scale = new Vector3(1, 1, 1),
    localMatrix: Mat4 = new Mat4(),
    worldMatrix: Mat4 = new Mat4(),
    parent: Node | null = null,
    useVertexColor: boolean = false,
  ) {
    super(
      id,
      name,
      translation,
      rotation,
      scale,
      localMatrix,
      worldMatrix,
      parent,
    );
    this.geometry = geometry;
    this.material = material;
    this.useVertexColor = useVertexColor;
  }

  static async from_json(json: MeshJSON): Promise<Mesh> {
    const geometry = json.geometry
      ? BufferGeometry.from_json(json.geometry)
      : null;
    if (!geometry) {
      throw new Error('Mesh geometry is required and cannot be null');
    }
    let material: ShaderMaterial;
    switch (json.materialType) {
      case 'BasicMaterial':
        material = BasicMaterial.from_json(json.material as BasicMaterialJSON);
        break;
      case 'PhongMaterial':
        material = PhongMaterial.from_json(json.material as PhongMaterialJSON);
        break;
      default:
        material = ShaderMaterial.from_json(json.material as ShaderMaterialJSON);
    }

    const translation = Vector3.from_json(json.translation);
    const rotation = Vector3.from_json(json.rotation);
    const scale = Vector3.from_json(json.scale);
    const localMatrix = Mat4.from_json(json.localMatrix);
    const worldMatrix = Mat4.from_json(json.worldMatrix);
    const useVertexColor = json.useVertexColor ?? false;

    const mesh = new Mesh(
      json.id,
      json.name,
      geometry,
      material,
      translation,
      rotation,
      scale,
      localMatrix,
      worldMatrix,
      null,
      useVertexColor,
    );

    return mesh;
  }

  to_json(): MeshJSON {
    const nodeJson = super.to_json();
    return {
      ...nodeJson,
      geometry: this.geometry ? this.geometry.to_json() : null,
      material: this.material ? this.material.to_json() : null,
      materialType: this.material instanceof BasicMaterial
        ? 'BasicMaterial'
        : this.material instanceof PhongMaterial
        ? 'PhongMaterial'
        : 'ShaderMaterial',
      useVertexColor: this.useVertexColor,
    };
  }
}

export default Mesh;
