import VectorInterface from '@/webgl/Interfaces/Types/VectorInterface';
import Coordinate from '../Coordinate';

export interface Vector3JSON {
  x: number;
  y: number;
  z: number;
}

class Vector3 extends Coordinate implements VectorInterface {
  public constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0,
  ) {
    super(x, y, z, 0);
  }

  public getTripleCoords(): readonly [number, number, number] {
    return [this.x, this.y, this.z];
  }

  public norm(): Vector3 {
    const length = Math.sqrt(
      this.x * this.x + this.y * this.y + this.z * this.z,
    );

    return length < 1e-6
      ? new Vector3(0, 0, 0)
      : new Vector3(this.x / length, this.y / length, this.z / length);
  }

  public dot(other: Vector3): number {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }

  public subtract(other: Vector3): Vector3 {
    return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
  }

  public cross(other: Vector3): Vector3 {
    return new Vector3(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x,
    );
  }
  public clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }

  static rotateY(vec: Vector3, angleInRadians: number): Vector3 {
    const cosAngle = Math.cos(angleInRadians);
    const sinAngle = Math.sin(angleInRadians);
    const x = vec.x * cosAngle + vec.z * sinAngle;
    const z = -vec.x * sinAngle + vec.z * cosAngle;
    return new Vector3(x, vec.y, z);
  }

  static rotateX(vec: Vector3, angleInRadians: number): Vector3 {
    const cosAngle = Math.cos(angleInRadians);
    const sinAngle = Math.sin(angleInRadians);
    const y = vec.y * cosAngle - vec.z * sinAngle;
    const z = vec.y * sinAngle + vec.z * cosAngle;
    return new Vector3(vec.x, y, z);
  }
      
  add(other: Vector3): Vector3 {
      return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
  }
  
  multiply(multiplier: number): Vector3 {
      return new Vector3(this.x * multiplier, this.y * multiplier, this.z * multiplier);
  }

  public normalize(): Vector3 {
    const length = Math.sqrt(
      this.x * this.x + this.y * this.y + this.z * this.z,
    );

    if (length > 0) {
      this.x /= length;
      this.y /= length;
      this.z /= length;
    }

    return this;
  }

  public subVectors(v1: Vector3, v2: Vector3): Vector3 {
    return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
  }

  to_json(): Vector3JSON {
    return {
      x: this.x,
      y: this.y,
      z: this.z,
    };
  }

  static from_json(json: Vector3JSON): Vector3 {
    return new Vector3(json.x, json.y, json.z);
  }
}

export default Vector3;
