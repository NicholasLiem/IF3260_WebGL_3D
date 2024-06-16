import { BufferAttribute } from '../../BufferAttribute';
import { BufferGeometry } from '../../BufferGeometry';

export class HollowTesseractGeometry extends BufferGeometry {
  constructor(width = 1, height = 1, depth = 1, thickness = 0.1) {
    super();
    const hw = width / 2;
    const hh = height / 2;
    const hd = depth / 2;
    const t = thickness / 2; // Half thickness for easier calculations

    const shw = hw / 2;
    const shh = hh / 2;
    const shd = hd / 2;

    const vertices = new Float32Array([
      // BIG BOX
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

      // SMALL BOX
      // BOTTOM
      // Front Front Left bottom corner (bawah kiri, bawah kanan, atas kanan, atas kiri)
      -shw,
      -shh,
      shd,
      -shw + t,
      -shh,
      shd,
      -shw + t,
      -shh + t,
      shd,
      -shw,
      -shh + t,
      shd, // (0, 1, 2, 3)

      // Front Back Left bottom corner
      -shw,
      -shh,
      shd - t,
      -shw + t,
      -shh,
      shd - t,
      -shw + t,
      -shh + t,
      shd - t,
      -shw,
      -shh + t,
      shd - t, // (4, 5, 6, 7)
      // Front Front right bottom corner
      shw - t,
      -shh,
      shd,
      shw,
      -shh,
      shd,
      shw,
      -shh + t,
      shd,
      shw - t,
      -shh + t,
      shd, // (8, 9, 10, 11)

      // Front Back Right Bottom Corner
      shw - t,
      -shh,
      shd - t,
      shw,
      -shh,
      shd - t,
      shw,
      -shh + t,
      shd - t,
      shw - t,
      -shh + t,
      shd - t, // (12, 13, 14, 15)

      // Back front right bottom corner
      shw - t,
      -shh,
      -shd + t,
      shw,
      -shh,
      -shd + t,
      shw,
      -shh + t,
      -shd + t,
      shw - t,
      -shh + t,
      -shd + t, // (16, 17, 18, 19)

      // Back back right bottom corner
      shw - t,
      -shh,
      -shd,
      shw,
      -shh,
      -shd,
      shw,
      -shh + t,
      -shd,
      shw - t,
      -shh + t,
      -shd, // (20, 21, 22, 23)

      // Back front left bottom corner
      -shw,
      -shh,
      -shd + t,
      -shw + t,
      -shh,
      -shd + t,
      -shw + t,
      -shh + t,
      -shd + t,
      -shw,
      -shh + t,
      -shd + t, // (24, 25, 26, 27)

      // Back back left bottom corner
      -shw,
      -shh,
      -shd,
      -shw + t,
      -shh,
      -shd,
      -shw + t,
      -shh + t,
      -shd,
      -shw,
      -shh + t,
      -shd, // (28, 29, 30, 31)

      // TOP
      // Front Front Left TOP corner (bawah kiri, bawah kanan, atas kanan, atas kiri)
      -shw,
      shh - t,
      shd,
      -shw + t,
      shh - t,
      shd,
      -shw + t,
      shh,
      shd,
      -shw,
      shh,
      shd, // (32, 33, 34, 35)

      // Front Back Left TOP corner
      -shw,
      shh - t,
      shd - t,
      -shw + t,
      shh - t,
      shd - t,
      -shw + t,
      shh,
      shd - t,
      -shw,
      shh,
      shd - t, // (36, 37, 38, 39)
      // Front Front right TOP corner
      shw - t,
      shh - t,
      shd,
      shw,
      shh - t,
      shd,
      shw,
      shh,
      shd,
      shw - t,
      shh,
      shd, // (40, 41, 42, 43)

      // Front Back Right TOP Corner
      shw - t,
      shh - t,
      shd - t,
      shw,
      shh - t,
      shd - t,
      shw,
      shh,
      shd - t,
      shw - t,
      shh,
      shd - t, // (44, 45, 46, 47)

      // Back front right TOP corner
      shw - t,
      shh - t,
      -shd + t,
      shw,
      shh - t,
      -shd + t,
      shw,
      shh,
      -shd + t,
      shw - t,
      shh,
      -shd + t, // (48, 49, 50, 51)

      // Back back right TOP corner
      shw - t,
      shh - t,
      -shd,
      shw,
      shh - t,
      -shd,
      shw,
      shh,
      -shd,
      shw - t,
      shh,
      -shd, // (52, 53, 54, 55)

      // Back front left TOP corner
      -shw,
      shh - t,
      -shd + t,
      -shw + t,
      shh - t,
      -shd + t,
      -shw + t,
      shh,
      -shd + t,
      -shw,
      shh,
      -shd + t, // (56, 57, 58, 59)

      // Back back left TOP corner
      -shw,
      shh - t,
      -shd,
      -shw + t,
      shh - t,
      -shd,
      -shw + t,
      shh,
      -shd,
      -shw,
      shh,
      -shd, // (60, 61, 62, 63)
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

      // SMALL BOX
      64,
      73,
      74,
      64,
      74,
      67, // Front edge between Left bottom corner and Right bottom corner
      66,
      75,
      79,
      66,
      79,
      70, // Top edge between left and right bottom corner
      69,
      76,
      79,
      69,
      79,
      70, // Back edge between left and right bottom corner
      64,
      72,
      76,
      64,
      76,
      68, // Bottom edge between left and right bottom corner

      76,
      80,
      83,
      76,
      83,
      79, // Left side edge between front and back right bottom corner
      14,
      22,
      23,
      14,
      23,
      15, // Top
      9 + 64,
      21 + 64,
      22 + 64,
      9 + 64,
      22 + 64,
      10 + 64, // Right
      9 + 64,
      21 + 64,
      20 + 64,
      9 + 64,
      20 + 64,
      8 + 64, // Bottom

      0 + 64,
      28 + 64,
      31 + 64,
      0 + 64,
      31 + 64,
      3 + 64, // Left side edge between front and back left bottom corner
      6 + 64,
      30 + 64,
      31 + 64,
      6 + 64,
      31 + 64,
      7 + 64, // Top
      5 + 64,
      25 + 64,
      26 + 64,
      5 + 64,
      26 + 64,
      6 + 64, // Right
      5 + 64,
      28 + 64,
      29 + 64,
      5 + 64,
      29 + 64,
      4 + 64, // Bottom

      25 + 64,
      16 + 64,
      19 + 64,
      25 + 64,
      19 + 64,
      26 + 64, // Front side edge between back left and rigt bottom corner
      26 + 64,
      19 + 64,
      23 + 64,
      26 + 64,
      23 + 64,
      30 + 64, // Top
      28 + 64,
      21 + 64,
      22 + 64,
      28 + 64,
      22 + 64,
      31 + 64, // Back
      24 + 64,
      17 + 64,
      21 + 64,
      24 + 64,
      21 + 64,
      28 + 64, // Bottom

      2 + 64,
      33 + 64,
      32 + 64,
      2 + 64,
      32 + 64,
      3 + 64, // Front side edge between bottom and top left corner
      3 + 64,
      32 + 64,
      36 + 64,
      3 + 64,
      36 + 64,
      7 + 64, // Left
      7 + 64,
      37 + 64,
      36 + 64,
      7 + 64,
      36 + 64,
      6 + 64, // Back
      2 + 64,
      33 + 64,
      37 + 64,
      2 + 64,
      37 + 64,
      6 + 64, // Right

      10 + 64,
      41 + 64,
      40 + 64,
      10 + 64,
      40 + 64,
      11 + 64, // Front side edge between bottom and top right corner
      11 + 64,
      40 + 64,
      44 + 64,
      11 + 64,
      44 + 64,
      15 + 64, // Left
      14 + 64,
      45 + 64,
      44 + 64,
      14 + 64,
      44 + 64,
      15 + 64, // Back
      10 + 64,
      41 + 64,
      45 + 64,
      10 + 64,
      45 + 64,
      14 + 64, // Right

      18 + 64,
      49 + 64,
      48 + 64,
      18 + 64,
      48 + 64,
      19 + 64, // Front side edge between bottom and top right corner (Back)
      19 + 64,
      48 + 64,
      52 + 64,
      19 + 64,
      52 + 64,
      23 + 64, // Left
      22 + 64,
      53 + 64,
      52 + 64,
      22 + 64,
      52 + 64,
      23 + 64, // Back
      18 + 64,
      49 + 64,
      53 + 64,
      18 + 64,
      53 + 64,
      22 + 64, // Right

      26 + 64,
      57 + 64,
      56 + 64,
      26 + 64,
      56 + 64,
      27 + 64, // Front side edge between back bottom and top left corner
      27 + 64,
      56 + 64,
      60 + 64,
      27 + 64,
      60 + 64,
      31 + 64, // Left
      30 + 64,
      61 + 64,
      60 + 64,
      30 + 64,
      60 + 64,
      31 + 64, // Back
      26 + 64,
      57 + 64,
      61 + 64,
      26 + 64,
      61 + 64,
      30 + 64, // Right

      // TOP FRAME
      32 + 64,
      41 + 64,
      42 + 64,
      32 + 64,
      42 + 64,
      35 + 64, // Front side edge between top left and right
      35 + 64,
      42 + 64,
      46 + 64,
      35 + 64,
      46 + 64,
      39 + 64, // Top
      37 + 64,
      44 + 64,
      47 + 64,
      37 + 64,
      47 + 64,
      38 + 64, // Back
      33 + 64,
      40 + 64,
      44 + 64,
      33 + 64,
      44 + 64,
      37 + 64, // Bottom

      32 + 64,
      60 + 64,
      63 + 64,
      32 + 64,
      63 + 64,
      35 + 64, // Left Edge between front and back top left corner
      38 + 64,
      58 + 64,
      59 + 64,
      38 + 64,
      59 + 64,
      39 + 64, // Top
      37 + 64,
      57 + 64,
      58 + 64,
      37 + 64,
      58 + 64,
      38 + 64, // Right
      37 + 64,
      57 + 64,
      56 + 64,
      37 + 64,
      56 + 64,
      36 + 64, // Bottom

      57 + 64,
      48 + 64,
      51 + 64,
      57 + 64,
      51 + 64,
      58 + 64, // Front Edge between left and right  top back corner
      59 + 64,
      50 + 64,
      54 + 64,
      59 + 64,
      54 + 64,
      63 + 64, // Top
      60 + 64,
      53 + 64,
      54 + 64,
      60 + 64,
      54 + 64,
      63 + 64, // Back
      57 + 64,
      48 + 64,
      52 + 64,
      57 + 64,
      52 + 64,
      61 + 64, // Bottom

      44 + 64,
      48 + 64,
      51 + 64,
      44 + 64,
      51 + 64,
      47 + 64, // Left Edge between front and back top right corner
      46 + 64,
      50 + 64,
      51 + 64,
      46 + 64,
      51 + 64,
      47 + 64, // Top
      41 + 64,
      53 + 64,
      54 + 64,
      41 + 64,
      54 + 64,
      42 + 64, // Right
      45 + 64,
      49 + 64,
      48 + 64,
      45 + 64,
      48 + 64,
      44 + 64, // Bottom
      // Diagonals
      // Front Left bottom
      4,
      68,
      71,
      4,
      71,
      7, // Left
      2,
      66,
      71,
      2,
      71,
      7, // Top
      1,
      65,
      66,
      1,
      66,
      2, // Right
      1,
      65,
      68,
      1,
      68,
      4, // Bottom
      // Front Right Bottom
      8,
      72,
      75,
      8,
      75,
      11, // Left
      11,
      75,
      78,
      11,
      78,
      14, // Top
      13,
      77,
      78,
      13,
      78,
      14, // Right
      8,
      72,
      77,
      8,
      77,
      13, // Bottom
      // Back Right Bottom
      20,
      84,
      87,
      20,
      87,
      23, // Left
      18,
      82,
      87,
      18,
      87,
      23, // Top
      17,
      81,
      82,
      17,
      82,
      18, // Right
      17,
      81,
      84,
      17,
      84,
      20, // Bottom
      // Back Left Bottom
      24,
      88,
      91,
      24,
      91,
      27, // Left
      27,
      91,
      94,
      27,
      94,
      30, // Top
      29,
      93,
      94,
      29,
      94,
      30, // Right
      24,
      88,
      93,
      24,
      93,
      29, // Bottom
      // Front Left Top
      36,
      100,
      103,
      36,
      103,
      39, // Left
      34,
      98,
      103,
      34,
      103,
      39, // Top
      33,
      97,
      98,
      33,
      98,
      34, // Right
      33,
      97,
      100,
      33,
      100,
      36, // Bottom
      // Front Right Top
      40,
      104,
      107,
      40,
      107,
      43, // Left
      43,
      107,
      110,
      43,
      110,
      46, // Top
      45,
      109,
      110,
      45,
      110,
      46, // Right
      40,
      104,
      109,
      40,
      109,
      45, // Bottom
      // Back Right Top
      52,
      116,
      119,
      52,
      119,
      55, // Left
      50,
      114,
      116,
      50,
      116,
      52, // Top
      49,
      113,
      114,
      49,
      114,
      50, // Right
      49,
      113,
      116,
      49,
      116,
      52, // Bottom
      // Back Left Top
      56,
      120,
      123,
      56,
      123,
      59, // Left
      59,
      123,
      126,
      59,
      126,
      62, // Top
      61,
      125,
      126,
      61,
      126,
      62, // Right
      56,
      120,
      125,
      56,
      125,
      61, // Bottom
    ]);

    const colors = new Float32Array([
      // Front face colors (red)
      1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1,
      // Back face colors (green)
      0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
      // // Top face colors (blue)
      0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1,

      // // Right face colors (magenta)
      1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1,
      // // Left face colors (cyan)
      0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1,

      // // Bottom face colors (yellow)
      1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1,
      // Front face colors (red)
      1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1,
      // Back face colors (green)
      0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
      // // Top face colors (blue)
      0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1,

      // // Right face colors (magenta)
      1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1,
      // // Left face colors (cyan)
      0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1,

      // // Bottom face colors (yellow)
      1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1,
      // Front face colors (red)
      1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1,
      // Back face colors (green)
      0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
      // // Top face colors (blue)
      0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1,

      // // Right face colors (magenta)
      1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1,
      // // Left face colors (cyan)
      0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1,

      // // Bottom face colors (yellow)
      1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1,
      // Front face colors (red)
      1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1,
      // Back face colors (green)
      0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
      // // Top face colors (blue)
      0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1,

      // // Right face colors (magenta)
      1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1,
      // // Left face colors (cyan)
      0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1,

      // // Bottom face colors (yellow)
      1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1,
      // Front face colors (red)
      1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1,
      // Back face colors (green)
      0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
      // // Top face colors (blue)
      0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1,

      // // Right face colors (magenta)
      1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1,
      // // Left face colors (cyan)
      0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1,

      // // Bottom face colors (yellow)
      1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1,

      // Front face colors (red)
      1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1,
      // Back face colors (green)
      0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
      // // Top face colors (blue)
      0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1,

      // // Right face colors (magenta)
      1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1,
      // // Left face colors (cyan)
      0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1,

      // // Bottom face colors (yellow)
      1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1,
      // Diagonals
    ]);

    this.setAttribute('position', new BufferAttribute(vertices, 3));
    this.setAttribute('color', new BufferAttribute(colors, 4));
    this.setAttribute('texCoord', new BufferAttribute(new Float32Array([]), 2));
    this.setAttribute('tangent', new BufferAttribute(new Float32Array([]), 3));
    this.setIndices(new BufferAttribute(indices, 1));
    this.calculateNormals();
  }
}
