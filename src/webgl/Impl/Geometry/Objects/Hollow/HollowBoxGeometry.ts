import { BufferAttribute } from '../../BufferAttribute';
import { BufferGeometry } from '../../BufferGeometry';

export class HollowBoxGeometry extends BufferGeometry {
  constructor(width = 1, height = 1, depth = 1, thickness = 0.1) {
    super();
    const hw = width / 2;
    const hh = height / 2;
    const hd = depth / 2;
    const t = thickness / 2; // Half thickness for easier calculations

    const vertices = new Float32Array([
      // BOTTOM
      // Front Front Left bottom corner (bawah kiri, bawah kanan, atas kanan, atas kiri)
      -hw,
      -hh,
      hd,
      -hw + t,
      -hh,
      hd,
      -hw + t,
      -hh + t,
      hd,
      -hw,
      -hh + t,
      hd, // (0, 1, 2, 3)

      // Front Back Left bottom corner
      -hw,
      -hh,
      hd - t,
      -hw + t,
      -hh,
      hd - t,
      -hw + t,
      -hh + t,
      hd - t,
      -hw,
      -hh + t,
      hd - t, // (4, 5, 6, 7)
      // Front Front right bottom corner
      hw - t,
      -hh,
      hd,
      hw,
      -hh,
      hd,
      hw,
      -hh + t,
      hd,
      hw - t,
      -hh + t,
      hd, // (8, 9, 10, 11)

      // Front Back Right Bottom Corner
      hw - t,
      -hh,
      hd - t,
      hw,
      -hh,
      hd - t,
      hw,
      -hh + t,
      hd - t,
      hw - t,
      -hh + t,
      hd - t, // (12, 13, 14, 15)

      // Back front right bottom corner
      hw - t,
      -hh,
      -hd + t,
      hw,
      -hh,
      -hd + t,
      hw,
      -hh + t,
      -hd + t,
      hw - t,
      -hh + t,
      -hd + t, // (16, 17, 18, 19)

      // Back back right bottom corner
      hw - t,
      -hh,
      -hd,
      hw,
      -hh,
      -hd,
      hw,
      -hh + t,
      -hd,
      hw - t,
      -hh + t,
      -hd, // (20, 21, 22, 23)

      // Back front left bottom corner
      -hw,
      -hh,
      -hd + t,
      -hw + t,
      -hh,
      -hd + t,
      -hw + t,
      -hh + t,
      -hd + t,
      -hw,
      -hh + t,
      -hd + t, // (24, 25, 26, 27)

      // Back back left bottom corner
      -hw,
      -hh,
      -hd,
      -hw + t,
      -hh,
      -hd,
      -hw + t,
      -hh + t,
      -hd,
      -hw,
      -hh + t,
      -hd, // (28, 29, 30, 31)

      // TOP
      // Front Front Left TOP corner (bawah kiri, bawah kanan, atas kanan, atas kiri)
      -hw,
      hh - t,
      hd,
      -hw + t,
      hh - t,
      hd,
      -hw + t,
      hh,
      hd,
      -hw,
      hh,
      hd, // (32, 33, 34, 35)

      // Front Back Left TOP corner
      -hw,
      hh - t,
      hd - t,
      -hw + t,
      hh - t,
      hd - t,
      -hw + t,
      hh,
      hd - t,
      -hw,
      hh,
      hd - t, // (36, 37, 38, 39)
      // Front Front right TOP corner
      hw - t,
      hh - t,
      hd,
      hw,
      hh - t,
      hd,
      hw,
      hh,
      hd,
      hw - t,
      hh,
      hd, // (40, 41, 42, 43)

      // Front Back Right TOP Corner
      hw - t,
      hh - t,
      hd - t,
      hw,
      hh - t,
      hd - t,
      hw,
      hh,
      hd - t,
      hw - t,
      hh,
      hd - t, // (44, 45, 46, 47)

      // Back front right TOP corner
      hw - t,
      hh - t,
      -hd + t,
      hw,
      hh - t,
      -hd + t,
      hw,
      hh,
      -hd + t,
      hw - t,
      hh,
      -hd + t, // (48, 49, 50, 51)

      // Back back right TOP corner
      hw - t,
      hh - t,
      -hd,
      hw,
      hh - t,
      -hd,
      hw,
      hh,
      -hd,
      hw - t,
      hh,
      -hd, // (52, 53, 54, 55)

      // Back front left TOP corner
      -hw,
      hh - t,
      -hd + t,
      -hw + t,
      hh - t,
      -hd + t,
      -hw + t,
      hh,
      -hd + t,
      -hw,
      hh,
      -hd + t, // (56, 57, 58, 59)

      // Back back left TOP corner
      -hw,
      hh - t,
      -hd,
      -hw + t,
      hh - t,
      -hd,
      -hw + t,
      hh,
      -hd,
      -hw,
      hh,
      -hd, // (60, 61, 62, 63)

      //
      // Back face
      // -hw, -hh, -hd,   -hw, hh, -hd,   hw, hh, -hd,   hw, -hh, -hd,
      // // Top face
      // -hw, hh, -hd, -hw, hh, hd, hw, hh, hd, hw, hh, -hd,
      // // Bottom face
      // -hw, -hh, -hd, hw, -hh, -hd, hw, -hh, hd, -hw, -hh, hd,
      // // Right face
      // hw, -hh, -hd, hw, hh, -hd, hw, hh, hd, hw, -hh, hd,
      // // Left face
      // -hw, -hh, -hd, -hw, -hh, hd, -hw, hh, hd, -hw, hh, -hd
    ]);

    const indices = new Uint16Array([
      0,
      9,
      10,
      0,
      10,
      3, // Front edge between Left bottom corner and Right bottom corner
      2,
      11,
      15,
      2,
      15,
      6, // Top edge between left and right bottom corner
      5,
      12,
      15,
      5,
      15,
      6, // Back edge between left and right bottom corner
      0,
      8,
      12,
      0,
      12,
      4, // Bottom edge between left and right bottom corner

      12,
      16,
      19,
      12,
      19,
      15, // Left side edge between front and back right bottom corner
      14,
      22,
      23,
      14,
      23,
      15, // Top
      9,
      21,
      22,
      9,
      22,
      10, // Right
      9,
      21,
      20,
      9,
      20,
      8, // Bottom

      0,
      28,
      31,
      0,
      31,
      3, // Left side edge between front and back left bottom corner
      6,
      30,
      31,
      6,
      31,
      7, // Top
      5,
      25,
      26,
      5,
      26,
      6, // Right
      5,
      28,
      29,
      5,
      29,
      4, // Bottom

      25,
      16,
      19,
      25,
      19,
      26, // Front side edge between back left and rigt bottom corner
      26,
      19,
      23,
      26,
      23,
      30, // Top
      28,
      21,
      22,
      28,
      22,
      31, // Back
      24,
      17,
      21,
      24,
      21,
      28, // Bottom

      2,
      33,
      32,
      2,
      32,
      3, // Front side edge between bottom and top left corner
      3,
      32,
      36,
      3,
      36,
      7, // Left
      7,
      37,
      36,
      7,
      36,
      6, // Back
      2,
      33,
      37,
      2,
      37,
      6, // Right

      10,
      41,
      40,
      10,
      40,
      11, // Front side edge between bottom and top right corner
      11,
      40,
      44,
      11,
      44,
      15, // Left
      14,
      45,
      44,
      14,
      44,
      15, // Back
      10,
      41,
      45,
      10,
      45,
      14, // Right

      18,
      49,
      48,
      18,
      48,
      19, // Front side edge between bottom and top right corner (Back)
      19,
      48,
      52,
      19,
      52,
      23, // Left
      22,
      53,
      52,
      22,
      52,
      23, // Back
      18,
      49,
      53,
      18,
      53,
      22, // Right

      26,
      57,
      56,
      26,
      56,
      27, // Front side edge between back bottom and top left corner
      27,
      56,
      60,
      27,
      60,
      31, // Left
      30,
      61,
      60,
      30,
      60,
      31, // Back
      26,
      57,
      61,
      26,
      61,
      30, // Right

      // TOP FRAME
      32,
      41,
      42,
      32,
      42,
      35, // Front side edge between top left and right
      35,
      42,
      46,
      35,
      46,
      39, // Top
      37,
      44,
      47,
      37,
      47,
      38, // Back
      33,
      40,
      44,
      33,
      44,
      37, // Bottom

      32,
      60,
      63,
      32,
      63,
      35, // Left Edge between front and back top left corner
      38,
      58,
      59,
      38,
      59,
      39, // Top
      37,
      57,
      58,
      37,
      58,
      38, // Right
      37,
      57,
      56,
      37,
      56,
      36, // Bottom

      57,
      48,
      51,
      57,
      51,
      58, // Front Edge between left and right  top back corner
      59,
      50,
      54,
      59,
      54,
      63, // Top
      60,
      53,
      54,
      60,
      54,
      63, // Back
      57,
      48,
      52,
      57,
      52,
      61, // Bottom

      44,
      48,
      51,
      44,
      51,
      47, // Left Edge between front and back top right corner
      46,
      50,
      51,
      46,
      51,
      47, // Top
      41,
      53,
      54,
      41,
      54,
      42, // Right
      45,
      49,
      48,
      45,
      48,
      44, // Bottom
    ]);

    const colors = new Float32Array([
      // // Front face colors (red)
      // 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1,
      // // Back face colors (green)
      // 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
      // // // Top face colors (blue)
      // 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1,
      // // // Right face colors (magenta)
      // 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1,
      // // // Left face colors (cyan)
      // 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1,
      // // // Bottom face colors (yellow)
      // 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1
    ]);

    this.setAttribute('position', new BufferAttribute(vertices, 3));
    this.setAttribute('color', new BufferAttribute(colors, 4));
    this.setIndices(new BufferAttribute(indices, 1));
    this.setAttribute('texCoord', new BufferAttribute(new Float32Array([]), 2));
    this.setAttribute('tangent', new BufferAttribute(new Float32Array([]), 3));
    this.calculateNormals();
  }
}
