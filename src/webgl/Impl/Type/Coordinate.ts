import CoordinateInterface from '../../Interfaces/Types/CoordinateInterface';

class Coordinate implements CoordinateInterface {
  public constructor(
    public x: number,
    public y: number,
    public z: number,
    public w: number,
  ) {}

  public getQuadrupleCoords(): [number, number, number, number] {
    return [this.x, this.y, this.z, this.w];
  }

  public dotProduct(other: Coordinate): number {
    return (
      this.x * other.x + this.y * other.y + this.z * other.z + this.w * other.w
    );
  }

  public getX(): number {
    return this.x;
  }
  public getY(): number {
    return this.y;
  }
  public getZ(): number {
    return this.z;
  }
  public getW(): number {
    return this.w;
  }

  public setX(value: number): void {
    this.x = value;
  }
  public setY(value: number): void {
    this.y = value;
  }
  public setZ(value: number): void {
    this.z = value;
  }
  public setW(value: number): void {
    this.w = value;
  }
}

export default Coordinate;
