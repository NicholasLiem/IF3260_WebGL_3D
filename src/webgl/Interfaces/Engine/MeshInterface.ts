import { BufferGeometry } from '@/webgl/Impl/Geometry/BufferGeometry';
import { ShaderMaterial } from '@/webgl/Impl/Material/ShaderMaterial';

interface MeshInterface {
  geometry: BufferGeometry;
  material: ShaderMaterial;
}

export default MeshInterface;
