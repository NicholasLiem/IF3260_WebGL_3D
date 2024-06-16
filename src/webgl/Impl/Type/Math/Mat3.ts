class Mat3 {
    public elements: Float32Array;
  
    constructor() {
      this.elements = new Float32Array(9);
      this.identity();
    }
  
    identity(): this {
      this.elements.set([
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
      ]);
      return this;
    }
  
    static fromMat4(out: Mat3, mat4: Float32Array): Mat3 {
      out.elements[0] = mat4[0];
      out.elements[1] = mat4[1];
      out.elements[2] = mat4[2];
      out.elements[3] = mat4[4];
      out.elements[4] = mat4[5];
      out.elements[5] = mat4[6];
      out.elements[6] = mat4[8];
      out.elements[7] = mat4[9];
      out.elements[8] = mat4[10];
      return out;
    }
  
    static inverse(out: Mat3, mat: Mat3): Mat3 {
      const a = mat.elements;
      const b00 = a[4] * a[8] - a[5] * a[7];
      const b01 = a[2] * a[7] - a[1] * a[8];
      const b02 = a[1] * a[5] - a[2] * a[4];
      const det = a[0] * b00 + a[3] * b01 + a[6] * b02;
  
      if (!det) {
        console.error('Matrix is singular and cannot be inverted.');
        return out.identity();
      }
  
      const invDet = 1.0 / det;
      out.elements.set([
        b00 * invDet,
        b01 * invDet,
        b02 * invDet,
        (a[5] * a[6] - a[3] * a[8]) * invDet,
        (a[0] * a[8] - a[2] * a[6]) * invDet,
        (a[2] * a[3] - a[0] * a[5]) * invDet,
        (a[3] * a[7] - a[4] * a[6]) * invDet,
        (a[1] * a[6] - a[0] * a[7]) * invDet,
        (a[0] * a[4] - a[1] * a[3]) * invDet,
      ]);
  
      return out;
    }
  
    static transpose(out: Mat3, mat: Mat3): Mat3 {
      const a = mat.elements;
      out.elements.set([
        a[0], a[3], a[6],
        a[1], a[4], a[7],
        a[2], a[5], a[8],
      ]);
      return out;
    }
  
    static normalFromMat4(out: Mat3, mat4: Float32Array): Mat3 {
      const tempMat3 = new Mat3();
      Mat3.fromMat4(tempMat3, mat4);
      Mat3.inverse(tempMat3, tempMat3);
      Mat3.transpose(out, tempMat3);
      return out;
    }
  
    toJSON(): number[] {
      return Array.from(this.elements);
    }
  
    static fromJSON(json: number[]): Mat3 {
      const mat = new Mat3();
      mat.elements.set(json);
      return mat;
    }
}
  
export { Mat3 };
  