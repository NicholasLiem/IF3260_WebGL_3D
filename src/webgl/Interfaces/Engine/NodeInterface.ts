import { Mat4 } from '@/webgl/Impl/Type/Math/Mat4';
import Skin from './SkinInterface';
import Vector from '@/webgl/Impl/Type/Math/Vector3';

interface NodeInterface {
  id: number;
  name: string;
  children?: NodeInterface[];
  skin?: Skin;
  animations?: Animation[];
  localMatrix: Mat4;
  worldMatrix: Mat4;
  // Representasi Transformasi Node menggunakan TRS
  translation: Vector;
  rotation: Vector;
  scale: Vector;
}

export default NodeInterface;
