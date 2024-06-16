import { BufferAttribute } from '../../BufferAttribute';
import { BufferGeometry } from '../../BufferGeometry';

export class SphereGeometry extends BufferGeometry {
  constructor(radius: number = 1, widthSegments: number = 8, heightSegments: number = 6) {
    super();
    const vertices: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];
    const texCoords: number[] = [];

    for (let latNumber = 0; latNumber <= heightSegments; latNumber++) {
      const theta = (latNumber * Math.PI) / heightSegments;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let longNumber = 0; longNumber <= widthSegments; longNumber++) {
        const phi = (longNumber * 2 * Math.PI) / widthSegments;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        const x = cosPhi * sinTheta;
        const y = cosTheta;
        const z = sinPhi * sinTheta;

        vertices.push(radius * x);
        vertices.push(radius * y);
        vertices.push(radius * z);

        const r = (x + 1) / 2;
        const g = (y + 1) / 2;
        const b = (z + 1) / 2;
        colors.push(r, g, b, 1);

        texCoords.push(longNumber / widthSegments);
        texCoords.push(latNumber / heightSegments);
      }
    }

    for (let latNumber = 0; latNumber < heightSegments; latNumber++) {
      for (let longNumber = 0; longNumber < widthSegments; longNumber++) {
        const first = latNumber * (widthSegments + 1) + longNumber;
        const second = first + widthSegments + 1;
        indices.push(first);
        indices.push(second);
        indices.push(first + 1);

        indices.push(second);
        indices.push(second + 1);
        indices.push(first + 1);
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
