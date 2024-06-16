import { BufferAttribute } from '../../BufferAttribute';
import { BufferGeometry } from '../../BufferGeometry';

export class PlaneGeometry extends BufferGeometry {
  width: number;
  height: number;
  widthSegments: number;
  heightSegments: number;

  constructor(width = 1, height = 1, widthSegments = 10, heightSegments = 10) {
    super();
    this.width = width;
    this.height = height;
    this.widthSegments = widthSegments;
    this.heightSegments = heightSegments;

    const vertices = [];
    const indices = [];
    const colors = [];
    const texCoords = [];

    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const segmentWidth = width / widthSegments;
    const segmentHeight = height / heightSegments;

    // Generate vertices, colors, and texCoords
    for (let i = 0; i <= heightSegments; i++) {
      const y = i * segmentHeight - halfHeight;
      for (let j = 0; j <= widthSegments; j++) {
        const x = j * segmentWidth - halfWidth;
        vertices.push(x, 0, y);
        colors.push(1, 0, 0, 1);
        texCoords.push(j / widthSegments, i / heightSegments);
      }
    }

    // Generate indices
    for (let i = 0; i < heightSegments; i++) {
      for (let j = 0; j < widthSegments; j++) {
        const a = i * (widthSegments + 1) + j;
        const b = i * (widthSegments + 1) + j + 1;
        const c = (i + 1) * (widthSegments + 1) + j + 1;
        const d = (i + 1) * (widthSegments + 1) + j;

        // Two triangles per segment
        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    this.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
    this.setAttribute('color', new BufferAttribute(new Float32Array(colors), 4));
    this.setAttribute('texCoord', new BufferAttribute(new Float32Array(texCoords), 2));
    this.setIndices(new BufferAttribute(new Uint16Array(indices), 1));
    this.calculateNormals();
    this.calculateTangents();
  }
}
