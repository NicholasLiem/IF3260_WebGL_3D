import Vector3 from '@/webgl/Impl/Type/Math/Vector3';
import { BufferAttribute } from '../../BufferAttribute';
import { BufferGeometry } from '../../BufferGeometry';

export class ConeGeometry extends BufferGeometry {
  constructor(radius: number = 1, height: number = 1, radialSegments: number = 8) {
    super();
    const vertices: number[] = [];
    const indices: number[] = [];
    const colors: number[] = [];
    const texCoords: number[] = [];
    const angleStep = (Math.PI * 2) / radialSegments;

    // Apex point
    vertices.push(0, height / 2, 0);
    colors.push(1, 0, 0, 1);
    texCoords.push(0.5, 1);

    // Base circle points
    for (let i = 0; i <= radialSegments; i++) {
      const angle = i * angleStep;
      vertices.push(
        Math.cos(angle) * radius,
        -height / 2,
        Math.sin(angle) * radius,
      );
      colors.push(0, 0, 1, 1);
      texCoords.push(i / radialSegments, 0);
    }

    // Indices for the cone surface
    for (let i = 1; i <= radialSegments; i++) {
      indices.push(0, i, i + 1);
    }

    // Indices for the base
    const baseCenterIndex = vertices.length / 3;
    vertices.push(0, -height / 2, 0);
    colors.push(0, 1, 0, 1);
    texCoords.push(0.5, 0);

    for (let i = 1; i <= radialSegments; i++) {
      indices.push(baseCenterIndex, i + 1, i);
    }

    this.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
    this.setAttribute('color', new BufferAttribute(new Float32Array(colors), 4));
    this.setAttribute('texCoord', new BufferAttribute(new Float32Array(texCoords), 2));
    this.setIndices(new BufferAttribute(new Uint16Array(indices), 1));
    this.calculateNormals();
    this.calculateTangents();
  }
}
