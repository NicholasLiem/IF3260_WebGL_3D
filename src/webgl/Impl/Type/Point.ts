import PointInterface from '@/webgl/Interfaces/Types/PointInteface';
import Coordinate from './Coordinate';

export interface PointJSON {
  x: number;
  y: number;
  z: number;
}

class Point extends Coordinate implements PointInterface {
  public constructor(
    public x: number,
    public y: number,
    public z: number,
  ) {
    super(x, y, z, 1);
  }

  public getTripleCoords(): readonly [number, number, number] {
    return [this.x, this.y, this.z];
  }

  to_json(): PointJSON {
    return {
      x: this.x,
      y: this.y,
      z: this.z,
    };
  }

  static from_json(json: PointJSON): Point {
    return new Point(json.x, json.y, json.z);
  }
}

export default Point;
