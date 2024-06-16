import { BufferAttribute } from '../../BufferAttribute';
import { BufferGeometry } from '../../BufferGeometry';

export class CylinderGeometry extends BufferGeometry {
  constructor(topRadius = 1, bottomRadius = 1, height = 1, radialSegments = 8) {
    super();
    const vertices = [];
    const colors = [];
    const indices = [];
    const texCoords = [];
    const angleStep = (Math.PI * 2) / radialSegments;
    let index = 0;

    // Top circle
    vertices.push(0, height / 2, 0); // center top
    colors.push(1, 0, 0, 1); // Red color for the center top
    texCoords.push(0.5, 1);
    index++;
    for (let i = 0; i < radialSegments; i++) {
      const angle = i * angleStep;
      vertices.push(
        Math.cos(angle) * topRadius,
        height / 2,
        Math.sin(angle) * topRadius,
      );
      colors.push(1, 0, 0, 1); // Red color for the top vertices
      texCoords.push(Math.cos(angle) * 0.5 + 0.5, Math.sin(angle) * 0.5 + 0.5);
      if (i > 0) {
        indices.push(index, index - 1, 0);
      }
      index++;
    }
    indices.push(index - 1, 1, 0);

    // Bottom circle
    vertices.push(0, -height / 2, 0); // center bottom
    colors.push(0, 0, 1, 1); // Blue color for the center bottom
    texCoords.push(0.5, 0);
    index++;
    const bottomCenterIndex = index - 1;
    for (let i = 0; i < radialSegments; i++) {
      const angle = i * angleStep;
      vertices.push(
        Math.cos(angle) * bottomRadius,
        -height / 2,
        Math.sin(angle) * bottomRadius,
      );
      colors.push(0, 0, 1, 1); // Blue color for the bottom vertices
      texCoords.push(Math.cos(angle) * 0.5 + 0.5, Math.sin(angle) * 0.5 + 0.5);
      if (i > 0) {
        indices.push(index, index - 1, bottomCenterIndex);
      }
      index++;
    }
    indices.push(index - 1, bottomCenterIndex + 1, bottomCenterIndex);

    // Side faces
    for (let i = 1; i <= radialSegments; i++) {
      const nextIndex = (i % radialSegments) + 1;
      indices.push(i, nextIndex, bottomCenterIndex + nextIndex);
      indices.push(i, bottomCenterIndex + nextIndex, bottomCenterIndex + i);
    }

    this.setAttribute(
      'position',
      new BufferAttribute(new Float32Array(vertices), 3),
    );
    this.setAttribute(
      'color',
      new BufferAttribute(new Float32Array(colors), 4),
    );
    this.setAttribute(
      'texCoord',
      new BufferAttribute(new Float32Array(texCoords), 2),
    );
    this.setIndices(new BufferAttribute(new Uint16Array(indices), 1));
    this.calculateNormals();
    this.calculateTangents();
  }
}
