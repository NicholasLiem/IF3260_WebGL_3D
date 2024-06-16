import Point from '@/webgl/Impl/Type/Point';

interface CameraInterface {
  radius: number;
  angle: number;
  center: Point;
  type: CameraType;
}

export enum CameraType {
  Perspective = 'Perspective',
  Orthographic = 'Orthographic',
  Oblique = 'Oblique',
  Orbit = 'Orbit',
}

export default CameraInterface;
