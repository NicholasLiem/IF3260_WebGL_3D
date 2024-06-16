import QuaternionInterface from '../../Interfaces/Types/QuarternionInterface';
import Coordinate from './Coordinate';
import Vector3 from './Math/Vector3';

export interface QuaternionJSON {
  x: number;
  y: number;
  z: number;
  w: number;
}

class Quaternion extends Coordinate implements QuaternionInterface {
  public constructor(
    x: number = 0,
    y: number = 0,
    z: number = 0,
    w: number = 1,
  ) {
    super(x, y, z, w);
  }

  public norm(): number {
    return Math.sqrt(
      this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w,
    );
  }

  public normalize(): Quaternion {
    const n = this.norm();
    if (n < 1e-6) {
      return new Quaternion(0, 0, 0, 1);
    }

    return new Quaternion(this.x / n, this.y / n, this.z / n, this.w / n);
  }

  public multiply(q2: Quaternion): Quaternion {
    const w1 = this.w,
      x1 = this.x,
      y1 = this.y,
      z1 = this.z;
    const w2 = q2.w,
      x2 = q2.x,
      y2 = q2.y,
      z2 = q2.z;

    return new Quaternion(
      w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2, // X
      w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2, // Y
      w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2, // Z
      w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2, // W (scalar part)
    );
  }

  public getMat4(): Float32Array {
    const matrix = new Float32Array(16);
    const x = this.x,
      y = this.y,
      z = this.z,
      w = this.w;
    const x2 = x + x,
      y2 = y + y,
      z2 = z + z;
    const xx = x * x2,
      xy = x * y2,
      xz = x * z2;
    const yy = y * y2,
      yz = y * z2,
      zz = z * z2;
    const wx = w * x2,
      wy = w * y2,
      wz = w * z2;

    matrix[0] = 1 - (yy + zz);
    matrix[1] = xy + wz;
    matrix[2] = xz - wy;
    matrix[3] = 0;

    matrix[4] = xy - wz;
    matrix[5] = 1 - (xx + zz);
    matrix[6] = yz + wx;
    matrix[7] = 0;

    matrix[8] = xz + wy;
    matrix[9] = yz - wx;
    matrix[10] = 1 - (xx + yy);
    matrix[11] = 0;

    matrix[12] = 0;
    matrix[13] = 0;
    matrix[14] = 0;
    matrix[15] = 1;

    return matrix;
  }

  public toEuler(): Vector3 {
    const x = this.x,
      y = this.y,
      z = this.z,
      w = this.w;
    const ysqr = y * y;

    // Roll (x-axis rotation)
    const t0 = +2.0 * (w * x + y * z);
    const t1 = +1.0 - 2.0 * (x * x + ysqr);
    const roll = Math.atan2(t0, t1);

    // Pitch (y-axis rotation)
    let t2 = +2.0 * (w * y - z * x);
    t2 = t2 > 1.0 ? 1.0 : t2;
    t2 = t2 < -1.0 ? -1.0 : t2;
    const pitch = Math.asin(t2);

    // Yaw (z-axis rotation)
    const t3 = +2.0 * (w * z + x * y);
    const t4 = +1.0 - 2.0 * (ysqr + z * z);
    const yaw = Math.atan2(t3, t4);

    return new Vector3(roll, pitch, yaw);
  }

  // euler in degree
  static fromEuler(euler: Vector3): Quaternion {
    const cos = Math.cos;
    const sin = Math.sin;
    const x = (Math.PI * euler.x) / 180 / 2;
    const y = (Math.PI * euler.y) / 180 / 2;
    const z = (Math.PI * euler.z) / 180 / 2;

    const cx = cos(x);
    const cy = cos(y);
    const cz = cos(z);

    const sx = sin(x);
    const sy = sin(y);
    const sz = sin(z);

    return new Quaternion(
      sx * cy * cz - cx * sy * sz,
      cx * sy * cz + sx * cy * sz,
      cx * cy * sz - sx * sy * cz,
      cx * cy * cz + sx * sy * sz,
    );
  }

  public subtract(other: Quaternion): Quaternion {
    return new Quaternion(
      this.x - other.x,
      this.y - other.y,
      this.z - other.z,
      this.w - other.w
    );
  }

  public add(other: Quaternion): Quaternion {
    return new Quaternion(
      this.x + other.x,
      this.y + other.y,
      this.z + other.z,
      this.w + other.w
    );
  }

  public multiplyScalar(scalar: number): Quaternion {
    return new Quaternion(
      this.x * scalar,
      this.y * scalar,
      this.z * scalar,
      this.w * scalar
    );
  }

  public inverse(): Quaternion {
    const norm = this.norm();
    return new Quaternion(
      -this.x / norm,
      -this.y / norm,
      -this.z / norm,
      this.w / norm
    );
  }

  public pow(exponent: number): Quaternion {
    const norm = this.norm();
    const angle = Math.acos(this.w / norm);
    const newNorm = Math.pow(norm, exponent);
    return new Quaternion(
      this.x * Math.sin(angle * exponent) / Math.sin(angle),
      this.y * Math.sin(angle * exponent) / Math.sin(angle),
      this.z * Math.sin(angle * exponent) / Math.sin(angle),
      Math.cos(angle * exponent)
    ).multiplyScalar(newNorm);
  }

  static slerp(q1: Quaternion, q2: Quaternion, t: number): Quaternion {
    return q2.multiply(q1.inverse()).pow(t).multiply(q1);
  }


  to_json(): QuaternionJSON {
      return {
        x: this.x,
        y: this.y,
        z: this.z,
        w: this.w
      }
  }

  static from_json(json: QuaternionJSON): Quaternion {
      return new Quaternion(json.x, json.y, json.z, json.w);
  }
}

export default Quaternion;
