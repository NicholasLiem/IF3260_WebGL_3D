import Quaternion from '../Quarternion';
import Vector3 from './Vector3';

export interface Mat4JSON {
  elements: number[];
}

class Mat4 {
  public elements: Float32Array;
  public static create(): Float32Array {
    const matrix = new Float32Array(16);
    matrix[0] = matrix[5] = matrix[10] = matrix[15] = 1; // Identity matrix
    return matrix;
  }

  constructor() {
    // Initialize elements array using create() method
    this.elements = Mat4.create();
  }

  clone(): Mat4 {
    const newMat = new Mat4();
    newMat.elements.set(this.elements);
    return newMat;
  }

  static transformVector3(
    out: Vector3,
    matrix: Float32Array,
    vector: Vector3,
  ): void {
    const x = vector.x,
      y = vector.y,
      z = vector.z;

    // Homogeneous coordinates for the vector
    const w = 1;

    out.x = matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12] * w;
    out.y = matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13] * w;
    out.z = matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14] * w;

    // Normally, we ignore the w component after transformation because it should be 1
    // However, if you're working with perspective projection, it might be different and needs to be considered.
    // const wOut = matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15] * w;
    // if (wOut !== 1 && wOut !== 0) {
    //     out.x /= wOut;
    //     out.y /= wOut;
    //     out.z /= wOut;
    // }
  }

  static translate(
    out: Float32Array,
    matrix: Float32Array,
    values: Float32Array,
  ) {
    const x = values[0],
      y = values[1],
      z = values[2];
    const a00 = matrix[0],
      a01 = matrix[1],
      a02 = matrix[2],
      a03 = matrix[3];
    const a10 = matrix[4],
      a11 = matrix[5],
      a12 = matrix[6],
      a13 = matrix[7];
    const a20 = matrix[8],
      a21 = matrix[9],
      a22 = matrix[10],
      a23 = matrix[11];

    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;
    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;

    out[12] = a00 * x + a10 * y + a20 * z + matrix[12];
    out[13] = a01 * x + a11 * y + a21 * z + matrix[13];
    out[14] = a02 * x + a12 * y + a22 * z + matrix[14];
    out[15] = a03 * x + a13 * y + a23 * z + matrix[15];
  }

  static translateTranspose(
    out: Float32Array,
    matrix: Float32Array,
    values: Float32Array,
  ) {
    const temp = Mat4.create();
    temp[12] = values[0];
    temp[13] = values[1];
    temp[14] = values[2];

    Mat4.multiplyTranspose(out, matrix, temp);
  }

  static determinant(m: Float32Array): number {
    const m00 = m[0],
      m01 = m[1],
      m02 = m[2],
      m03 = m[3];
    const m10 = m[4],
      m11 = m[5],
      m12 = m[6],
      m13 = m[7];
    const m20 = m[8],
      m21 = m[9],
      m22 = m[10],
      m23 = m[11];
    const m30 = m[12],
      m31 = m[13],
      m32 = m[14],
      m33 = m[15];

    return (
      m00 *
        (m11 * m22 * m33 +
          m12 * m23 * m31 +
          m13 * m21 * m32 -
          m13 * m22 * m31 -
          m11 * m23 * m32 -
          m12 * m21 * m33) -
      m01 *
        (m10 * m22 * m33 +
          m12 * m23 * m30 +
          m13 * m20 * m32 -
          m13 * m22 * m30 -
          m10 * m23 * m32 -
          m12 * m20 * m33) +
      m02 *
        (m10 * m21 * m33 +
          m11 * m23 * m30 +
          m13 * m20 * m31 -
          m13 * m21 * m30 -
          m10 * m23 * m31 -
          m11 * m20 * m33) -
      m03 *
        (m10 * m21 * m32 +
          m11 * m22 * m30 +
          m12 * m20 * m31 -
          m12 * m21 * m30 -
          m10 * m22 * m31 -
          m11 * m20 * m32)
    );
  }

  static inverse(out: Float32Array, matrix: Float32Array) {
    const m00 = matrix[0],
      m01 = matrix[1],
      m02 = matrix[2],
      m03 = matrix[3];
    const m10 = matrix[4],
      m11 = matrix[5],
      m12 = matrix[6],
      m13 = matrix[7];
    const m20 = matrix[8],
      m21 = matrix[9],
      m22 = matrix[10],
      m23 = matrix[11];
    const m30 = matrix[12],
      m31 = matrix[13],
      m32 = matrix[14],
      m33 = matrix[15];

    const det = Mat4.determinant(matrix);

    if (det === 0) {
      console.error('Matrix is singular and cannot be inverted.');
      return null;
    }

    const invDet = 1.0 / det;

    out[0] =
      (m11 * m22 * m33 +
        m12 * m23 * m31 +
        m13 * m21 * m32 -
        m13 * m22 * m31 -
        m11 * m23 * m32 -
        m12 * m21 * m33) *
      invDet;
    out[1] =
      (m01 * m22 * m33 +
        m02 * m23 * m31 +
        m03 * m21 * m32 -
        m03 * m22 * m31 -
        m01 * m23 * m32 -
        m02 * m21 * m33) *
      -invDet;
    out[2] =
      (m01 * m12 * m33 +
        m02 * m13 * m31 +
        m03 * m11 * m32 -
        m03 * m12 * m31 -
        m01 * m13 * m32 -
        m02 * m11 * m33) *
      invDet;
    out[3] =
      (m01 * m12 * m23 +
        m02 * m13 * m21 +
        m03 * m11 * m22 -
        m03 * m12 * m21 -
        m01 * m13 * m22 -
        m02 * m11 * m23) *
      -invDet;
    out[4] =
      (m10 * m22 * m33 +
        m12 * m23 * m30 +
        m13 * m20 * m32 -
        m13 * m22 * m30 -
        m10 * m23 * m32 -
        m12 * m20 * m33) *
      -invDet;
    out[5] =
      (m00 * m22 * m33 +
        m02 * m23 * m30 +
        m03 * m20 * m32 -
        m03 * m22 * m30 -
        m00 * m23 * m32 -
        m02 * m20 * m33) *
      invDet;
    out[6] =
      (m00 * m12 * m33 +
        m02 * m13 * m30 +
        m03 * m10 * m32 -
        m03 * m12 * m30 -
        m00 * m13 * m32 -
        m02 * m10 * m33) *
      -invDet;
    out[7] =
      (m00 * m12 * m23 +
        m02 * m13 * m20 +
        m03 * m10 * m22 -
        m03 * m12 * m20 -
        m00 * m13 * m22 -
        m02 * m10 * m23) *
      invDet;
    out[8] =
      (m10 * m21 * m33 +
        m11 * m23 * m30 +
        m13 * m20 * m31 -
        m13 * m21 * m30 -
        m10 * m23 * m31 -
        m11 * m20 * m33) *
      invDet;
    out[9] =
      (m00 * m21 * m33 +
        m01 * m23 * m30 +
        m03 * m20 * m31 -
        m03 * m21 * m30 -
        m00 * m23 * m31 -
        m01 * m20 * m33) *
      -invDet;
    out[10] =
      (m00 * m11 * m33 +
        m01 * m13 * m30 +
        m03 * m10 * m31 -
        m03 * m11 * m30 -
        m00 * m13 * m31 -
        m01 * m10 * m33) *
      invDet;
    out[11] =
      (m00 * m11 * m23 +
        m01 * m13 * m20 +
        m03 * m10 * m21 -
        m03 * m11 * m20 -
        m00 * m13 * m21 -
        m01 * m10 * m23) *
      -invDet;
    out[12] =
      (m10 * m21 * m32 +
        m11 * m22 * m30 +
        m12 * m20 * m31 -
        m12 * m21 * m30 -
        m10 * m22 * m31 -
        m11 * m20 * m32) *
      -invDet;
    out[13] =
      (m00 * m21 * m32 +
        m01 * m22 * m30 +
        m02 * m20 * m31 -
        m02 * m21 * m30 -
        m00 * m22 * m31 -
        m01 * m20 * m32) *
      invDet;
    out[14] =
      (m00 * m11 * m32 +
        m01 * m12 * m30 +
        m02 * m10 * m31 -
        m02 * m11 * m30 -
        m00 * m12 * m31 -
        m01 * m10 * m32) *
      -invDet;
    out[15] =
      (m00 * m11 * m22 +
        m01 * m12 * m20 +
        m02 * m10 * m21 -
        m02 * m11 * m20 -
        m00 * m12 * m21 -
        m01 * m10 * m22) *
      invDet;
  }

  static perspective(
    out: Float32Array,
    fov: number,
    aspect: number,
    near: number,
    far: number,
  ) {
    // const top = near * Math.tan(fov);
    // const right = top * aspect;
    // out[0] = near/right;
    // out[1] = 0;
    // out[2] = 0;
    // out[3] = 0;
    // out[4] = 0;
    // out[5] = near/top;
    // out[6] = 0;
    // out[7] = 0;
    // out[8] = 0;
    // out[9] = 0;
    // out[10] = (far + near) / (near - far);
    // out[11] = (2 * far * near) / (near - far);
    // out[12] = 0;
    // out[13] = 0;
    // out[14] = -1;
    // out[15] = 0;
    const f = 1.0 / Math.tan(fov / 2);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) / (near - far);
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) / (near - far);
    out[15] = 0;
  }

  // TODO
  static oblique(
    out: Float32Array,
    right: number,
    left: number,
    top: number,
    bottom: number,
    near: number,
    far: number,
    angle: number,
    scale: number = 0.5
  ) {
    // Convert angle to radians
    angle *= Math.PI / 180;
    let ortho = Mat4.create()
    Mat4.orthographic(ortho, right, left, top, bottom, near, far);
    const shear = new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      -scale * Math.cos(angle), scale * Math.sin(angle), 1, 0,
      0, 0, 0, 1,
  ]);
  // Multiply orthographic matrix by shear matrix
    Mat4.multiply(out, ortho, shear);
  }

  static orthographic(
    out: Float32Array,
    right: number,
    left: number,
    top: number,
    bottom: number,
    near: number,
    far: number,
  ) {
    // Calculate translations
    const tx = -(right + left) / 2;
    const ty = -(top + bottom) / 2;
    const tz = (far + near) / 2;

    // Calculate scalings
    const sx = 2 / (right - left);
    const sy = 2 / (top - bottom);
    const sz = 2 / (near - far);

    // Apply translation
    out[12] = tx * sx;
    out[13] = ty * sy;
    out[14] = tz * sz;

    // Apply scaling
    out[0] = sx;
    out[5] = sy;
    out[10] = sz;
  }

  static rotateX(out: Float32Array, matrix: Float32Array, angle: number): void {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const temp = Mat4.create();
    temp[5] = c;
    temp[6] = s;
    temp[9] = -s;
    temp[10] = c;

    Mat4.multiply(out, matrix, temp);
  }

  static rotateY(out: Float32Array, matrix: Float32Array, angle: number): void {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const temp = Mat4.create();
    temp[0] = c;
    temp[2] = -s;
    temp[8] = -s;
    temp[10] = c;
    Mat4.multiplyTranspose(out, matrix, temp);
  }

  static rotateZ(out: Float32Array, matrix: Float32Array, angle: number): void {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const temp = Mat4.create();
    temp[0] = c;
    temp[1] = s;
    temp[4] = -s;
    temp[5] = c;

    Mat4.multiply(out, matrix, temp);
  }

  static transpose(out: Float32Array, matrix: Float32Array): void {
    for (let row = 0; row < 4; ++row) {
      for (let col = 0; col < 4; ++col) {
        out[col * 4 + row] = matrix[row * 4 + col];
      }
    }
  }

  static scale(out: Float32Array, matrix: Float32Array, v: Float32Array): void {
    const temp = Mat4.create();
    temp[0] = v[0];
    temp[5] = v[1];
    temp[10] = v[2];
    Mat4.multiply(out, matrix, temp);
  }

  static shear(
    out: Float32Array,
    matrix: Float32Array,
    xy: number,
    xz: number,
  ): void {
    out.set(matrix);

    out[4] += xy * matrix[0]; // Shear y in proportion to x
    out[5] += xy * matrix[1];
    out[6] += xy * matrix[2];
    out[7] += xy * matrix[3];

    out[8] += xz * matrix[0]; // Shear z in proportion to x
    out[9] += xz * matrix[1];
    out[10] += xz * matrix[2];
    out[11] += xz * matrix[3];
  }

  static multiply(out: Float32Array, a: Float32Array, b: Float32Array): void {
    // Implement matrix multiplication manually
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        out[i * 4 + j] =
          a[i * 4 + 0] * b[0 * 4 + j] +
          a[i * 4 + 1] * b[1 * 4 + j] +
          a[i * 4 + 2] * b[2 * 4 + j] +
          a[i * 4 + 3] * b[3 * 4 + j];
      }
    }
  }

  static multiplyTranspose(
    out: Float32Array,
    a: Float32Array,
    b: Float32Array,
  ): void {
    // Assuming a & b is transposed
    var a00 = a[0 * 4 + 0];
    var a01 = a[0 * 4 + 1];
    var a02 = a[0 * 4 + 2];
    var a03 = a[0 * 4 + 3];
    var a10 = a[1 * 4 + 0];
    var a11 = a[1 * 4 + 1];
    var a12 = a[1 * 4 + 2];
    var a13 = a[1 * 4 + 3];
    var a20 = a[2 * 4 + 0];
    var a21 = a[2 * 4 + 1];
    var a22 = a[2 * 4 + 2];
    var a23 = a[2 * 4 + 3];
    var a30 = a[3 * 4 + 0];
    var a31 = a[3 * 4 + 1];
    var a32 = a[3 * 4 + 2];
    var a33 = a[3 * 4 + 3];
    var b00 = b[0 * 4 + 0];
    var b01 = b[0 * 4 + 1];
    var b02 = b[0 * 4 + 2];
    var b03 = b[0 * 4 + 3];
    var b10 = b[1 * 4 + 0];
    var b11 = b[1 * 4 + 1];
    var b12 = b[1 * 4 + 2];
    var b13 = b[1 * 4 + 3];
    var b20 = b[2 * 4 + 0];
    var b21 = b[2 * 4 + 1];
    var b22 = b[2 * 4 + 2];
    var b23 = b[2 * 4 + 3];
    var b30 = b[3 * 4 + 0];
    var b31 = b[3 * 4 + 1];
    var b32 = b[3 * 4 + 2];
    var b33 = b[3 * 4 + 3];

    out[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
    out[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
    out[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
    out[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
    out[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
    out[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
    out[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
    out[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
    out[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
    out[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
    out[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
    out[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
    out[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
    out[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
    out[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
    out[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;
  }

  private get(row: number, col: number): number {
    // Implement logic to get the element at the specified row and column
    return this.elements[row * 4 + col];
  }

  private set(value: number, row: number, col: number): void {
    // Implement logic to set the element at the specified row and column
    this.elements[row * 4 + col] = value;
  }

  static lookAt(
    out: Float32Array,
    eye: Vector3,
    target: Vector3,
    up: Vector3,
  ): void {
    let zAxis = eye.clone().subtract(target).norm();
    let xAxis = up.clone().cross(zAxis).norm();
    let yAxis = zAxis.clone().cross(xAxis).norm();
    out[0] = xAxis.x;
    out[1] = yAxis.x;
    out[2] = zAxis.x;
    out[3] = 0;
    out[4] = xAxis.y;
    out[5] = yAxis.y;
    out[6] = zAxis.y;
    out[7] = 0;
    out[8] = xAxis.z;
    out[9] = yAxis.z;
    out[10] = zAxis.z;
    out[11] = 0;

    out[12] = -xAxis.dot(eye);
    out[13] = -yAxis.dot(eye);
    out[14] = -zAxis.dot(eye);
    out[15] = 1;

    // out[0] = xAxis.x;
    // out[1] = xAxis.y;
    // out[2] = xAxis.z;
    // out[3] = 0;
    // out[4] = yAxis.x;
    // out[5] = yAxis.y;
    // out[6] = yAxis.z;
    // out[7] = 0;
    // out[8] = zAxis.x;
    // out[9] = zAxis.y;
    // out[10] = zAxis.z;
    // out[11] = 0;
    // out[12] = -xAxis.dot(eye);
    // out[13] = -yAxis.dot(eye);
    // out[14] = -zAxis.dot(eye);
    // out[15] = 1;
  }

  static translationMatrix(vector: Vector3): Float32Array {
    const matrix = Mat4.create();
    matrix[12] = vector.x;
    matrix[13] = vector.y;
    matrix[14] = vector.z;
    return matrix;
  }

  static fromQuaternion(out: Float32Array, q: Quaternion): void {
    const x = q.x;
    const y = q.y;
    const z = q.z;
    const w = q.w;

    out[0] = w * w + x * x - y * y - z * z;
    out[1] = 2 * (x * y - w * z);
    out[2] = 2 * (w * y + x * z);
    out[3] = 0;

    out[4] = 2 * (x * y + w * z);
    out[5] = w * w - x * x + y * y - z * z;
    out[6] = 2 * (y * z - w * x);
    out[7] = 0;

    out[8] = 2 * (x * z - w * y);
    out[9] = 2 * (w * x + y * z);
    out[10] = w * w - x * x - y * y + z * z;
    out[11] = 0;

    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
  }

  to_json(): Mat4JSON {
    return { elements: Array.from(this.elements) };
  }

  static from_json(json: Mat4JSON): Mat4 {
    const mat = new Mat4();
    mat.elements.set(json.elements);
    return mat;
  }
}

export { Mat4 };
