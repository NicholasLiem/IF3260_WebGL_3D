import Vector3 from '@/webgl/Impl/Type/Math/Vector3';
import { BufferAttribute } from '../../BufferAttribute';
import { BufferGeometry } from '../../BufferGeometry';

export class BoxGeometry extends BufferGeometry {
  constructor(width = 1, height = 1, depth = 1) {
    super();
    const hw = width / 2;
    const hh = height / 2;
    const hd = depth / 2;

    const vertices = new Float32Array([
      // Front face
      -hw, -hh, hd, hw, -hh, hd, hw, hh, hd, -hw, hh, hd,
      // Back face
      -hw, -hh, -hd, -hw, hh, -hd, hw, hh, -hd, hw, -hh, -hd,
      // Top face
      -hw, hh, -hd, -hw, hh, hd, hw, hh, hd, hw, hh, -hd,
      // Bottom face
      -hw, -hh, -hd, hw, -hh, -hd, hw, -hh, hd, -hw, -hh, hd,
      // Right face
      hw, -hh, -hd, hw, hh, -hd, hw, hh, hd, hw, -hh, hd,
      // Left face
      -hw, -hh, -hd, -hw, -hh, hd, -hw, hh, hd, -hw, hh, -hd,
    ]);

    const indices = new Uint16Array([
      0, 1, 2, 0, 2, 3,   // front
      4, 5, 6, 4, 6, 7,   // back
      8, 9, 10, 8, 10, 11, // top
      12, 13, 14, 12, 14, 15, // bottom
      16, 17, 18, 16, 18, 19, // right
      20, 21, 22, 20, 22, 23, // left
    ]);

    const colors = new Float32Array([
      // Front face colors (red)
      1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1,
      // Back face colors (green)
      0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
      // Top face colors (blue)
      0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1,
      // Bottom face colors (yellow)
      1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1,
      // Right face colors (magenta)
      1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1,
      // Left face colors (cyan)
      0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1,
    ]);

    const texCoords = new Float32Array([
      // Front face
      0, 0, 1, 0, 1, 1, 0, 1,
      // Back face
      0, 0, 1, 0, 1, 1, 0, 1,
      // Top face
      0, 0, 1, 0, 1, 1, 0, 1,
      // Bottom face
      0, 0, 1, 0, 1, 1, 0, 1,
      // Right face
      0, 0, 1, 0, 1, 1, 0, 1,
      // Left face
      0, 0, 1, 0, 1, 1, 0, 1,
    ]);

    const normals = new Float32Array([
      // Front face
      0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
      // Back face
      0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
      // Top face
      0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
      // Bottom face
      0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
      // Right face
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
      // Left face
      -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
    ]);

    this.setAttribute('position', new BufferAttribute(vertices, 3));
    this.setAttribute('color', new BufferAttribute(colors, 4));
    this.setAttribute('texCoord', new BufferAttribute(texCoords, 2));
    this.setAttribute('normal', new BufferAttribute(normals, 3));
    this.setIndices(new BufferAttribute(indices, 1));
    // this.calculateNormals();
    this.calculateTangents();
  }
}
