import { BufferAttribute } from '../../BufferAttribute';
import { BufferGeometry } from '../../BufferGeometry';

export class HollowOctahedronGeometry extends BufferGeometry {
  constructor(width = 1, height = 1, depth = 1, thickness = 0.07) {
    super();
    const hw = width / 2;
    const hh = height / 2;
    const hd = depth / 2;
    const t = thickness / 2; // Half thickness for easier calculations

    // for each box corner start from the front-bottom-left corner and go counter-clockwise
    const vertices = new Float32Array([
      // front corner
      -t,
      -t,
      hd + t,
      t,
      -t,
      hd + t,
      t,
      -t,
      hd - t,
      -t,
      -t,
      hd - t, // bottom face
      -t,
      t,
      hd + t,
      t,
      t,
      hd + t,
      t,
      t,
      hd - t,
      -t,
      t,
      hd - t, // top face
      // right corner
      hw - t,
      -t,
      t,
      hw + t,
      -t,
      t,
      hw + t,
      -t,
      -t,
      hw - t,
      -t,
      -t, // bottom face
      hw - t,
      t,
      t,
      hw + t,
      t,
      t,
      hw + t,
      t,
      -t,
      hw - t,
      t,
      -t, // top face
      // back corner
      -t,
      -t,
      -hd + t,
      t,
      -t,
      -hd + t,
      t,
      -t,
      -hd - t,
      -t,
      -t,
      -hd - t, // bottom face
      -t,
      t,
      -hd + t,
      t,
      t,
      -hd + t,
      t,
      t,
      -hd - t,
      -t,
      t,
      -hd - t, // top face
      // left corner
      -hw - t,
      -t,
      t,
      -hw + t,
      -t,
      t,
      -hw + t,
      -t,
      -t,
      -hw - t,
      -t,
      -t, // bottom face
      -hw - t,
      t,
      t,
      -hw + t,
      t,
      t,
      -hw + t,
      t,
      -t,
      -hw - t,
      t,
      -t, // top face
      // bottom corner
      -t,
      -hh - t,
      t,
      t,
      -hh - t,
      t,
      t,
      -hh - t,
      -t,
      -t,
      -hh - t,
      -t, // bottom face
      -t,
      -hh + t,
      t,
      t,
      -hh + t,
      t,
      t,
      -hh + t,
      -t,
      -t,
      -hh + t,
      -t, // top face
      // top corner
      -t,
      hh - t,
      t,
      t,
      hh - t,
      t,
      t,
      hh - t,
      -t,
      -t,
      hh - t,
      -t, // bottom face
      -t,
      hh + t,
      t,
      t,
      hh + t,
      t,
      t,
      hh + t,
      -t,
      -t,
      hh + t,
      -t, // top face
    ]);

    // colors was randomly generated
    const colors = new Float32Array([
      // front corner
      1,
      0,
      0,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      0,
      1, // bottom face
      1,
      0,
      0,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      0,
      1, // top face
      // right corner
      1,
      1,
      0,
      1,
      1,
      1,
      0,
      1,
      1,
      1,
      0,
      1,
      1,
      1,
      0,
      1, // bottom face
      1,
      1,
      0,
      1,
      1,
      1,
      0,
      1,
      1,
      1,
      0,
      1,
      1,
      1,
      0,
      1, // top face
      // back corner
      1,
      0,
      1,
      1,
      1,
      0,
      1,
      1,
      1,
      0,
      1,
      1,
      1,
      0,
      1,
      1, // bottom face
      1,
      0,
      1,
      1,
      1,
      0,
      1,
      1,
      1,
      0,
      1,
      1,
      1,
      0,
      1,
      1, // top face
      // left corner
      0,
      1,
      1,
      1,
      0,
      1,
      1,
      1,
      0,
      1,
      1,
      1,
      0,
      1,
      1,
      1, // bottom face
      0,
      1,
      1,
      1,
      0,
      1,
      1,
      1,
      0,
      1,
      1,
      1,
      0,
      1,
      1,
      1, // top face
      // bottom corner
      1,
      0.5,
      1,
      1,
      1,
      0.5,
      1,
      1,
      1,
      0.5,
      1,
      1,
      1,
      0.5,
      1,
      1, // bottom face
      1,
      0.5,
      1,
      1,
      1,
      0.5,
      1,
      1,
      1,
      0.5,
      1,
      1,
      1,
      0.5,
      1,
      1, // top face
      // top corner
      1,
      1,
      0,
      1,
      1,
      1,
      0,
      1,
      1,
      1,
      0,
      1,
      1,
      1,
      0,
      1, // bottom face
      1,
      1,
      0,
      1,
      1,
      1,
      0,
      1,
      1,
      1,
      0,
      1,
      1,
      1,
      0,
      1, // top face
    ]);

    const indices = new Uint16Array([
      // front
      0, 1, 5, 0, 5, 4, 2, 3, 7, 2, 7, 6,

      // right
      9, 10, 14, 9, 14, 13, 11, 8, 12, 11, 12, 15,

      // back
      16, 17, 21, 16, 21, 20, 18, 19, 23, 18, 23, 22,

      // left
      27, 24, 28, 27, 28, 31, 25, 26, 30, 25, 30, 29,

      // top
      44, 45, 46, 44, 46, 47, 41, 40, 43, 41, 43, 42,

      // bottom
      33, 32, 35, 33, 35, 34, 36, 37, 38, 36, 38, 39,

      // diagonal front-right
      1, 9, 13, 1, 13, 5, 5, 13, 12, 5, 12, 6, 8, 2, 6, 8, 6, 12, 9, 1, 2, 9, 2,
      8,

      // diagonal back-right
      17, 11, 15, 17, 15, 21, 21, 15, 14, 21, 14, 22, 10, 18, 22, 10, 22, 14,
      11, 17, 18, 11, 18, 10,

      // diagonal back-left
      26, 16, 20, 26, 20, 30, 30, 20, 23, 30, 23, 31, 19, 27, 31, 19, 31, 23,
      16, 26, 27, 16, 27, 19,

      // diagonal front-left
      24, 0, 4, 24, 4, 28, 28, 4, 7, 28, 7, 29, 3, 25, 29, 3, 29, 7, 0, 24, 25,
      0, 25, 3,

      // diagonal top-right
      41, 12, 13, 41, 13, 45, 45, 13, 14, 45, 14, 46, 15, 42, 46, 15, 46, 14,
      12, 41, 42, 12, 42, 15,

      // diagonal top-left
      28, 29, 40, 28, 40, 44, 29, 30, 43, 29, 43, 40, 30, 31, 47, 30, 47, 43,
      31, 28, 44, 31, 44, 47,

      // diagonal bottom-right
      9, 33, 37, 9, 37, 8, 8, 37, 38, 8, 38, 11, 34, 10, 11, 34, 11, 38, 9, 33,
      34, 9, 34, 10,

      // diagonal bottom-left
      24, 32, 36, 24, 36, 25, 25, 36, 39, 25, 39, 26, 35, 27, 26, 35, 26, 39,
      32, 24, 27, 32, 27, 35,

      // diagonal top-front
      4, 5, 45, 4, 45, 44, 5, 6, 41, 5, 41, 45, 6, 7, 40, 6, 40, 41, 7, 4, 44,
      7, 44, 40,

      // diagonal top-back
      20, 21, 42, 20, 42, 43, 21, 22, 46, 21, 46, 42, 22, 23, 47, 22, 47, 46,
      23, 20, 43, 23, 43, 47,

      // diagonal bottom-front
      32, 33, 1, 32, 1, 0, 33, 37, 2, 33, 2, 1, 37, 36, 3, 37, 3, 2, 36, 32, 0,
      36, 0, 3,

      // diagonal bottom-back
      39, 38, 17, 39, 17, 16, 34, 18, 17, 34, 17, 38, 34, 35, 19, 34, 19, 18,
      39, 35, 19, 39, 19, 16,
    ]);

    this.setAttribute('position', new BufferAttribute(vertices, 3));
    this.setAttribute('color', new BufferAttribute(colors, 4));
    this.setAttribute('texCoord', new BufferAttribute(new Float32Array([]), 2));
    this.setAttribute('tangent', new BufferAttribute(new Float32Array([]), 3));
    this.setIndices(new BufferAttribute(indices, 1));
    this.calculateNormals();
  }
}
