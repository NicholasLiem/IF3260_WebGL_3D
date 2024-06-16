import Vector3 from '../Type/Math/Vector3';
import { BufferAttribute, BufferAttributeJSON } from './BufferAttribute';

export interface BufferGeometryJSON {
  attributes: { [key: string]: BufferAttributeJSON };
  indices?: BufferAttributeJSON;
}

export class BufferGeometry {
  private _attributes: { [name: string]: BufferAttribute };
  private _indices?: BufferAttribute;

  constructor() {
    this._attributes = {};
  }

  get attributes() {
    return this._attributes;
  }

  get indices() {
    return this._indices;
  }

  setIndices(indices: BufferAttribute) {
    this._indices = indices;
    return this;
  }

  removeIndices() {
    this._indices = undefined;
    return this;
  }

  setAttribute(name: string, attribute: BufferAttribute) {
    this._attributes[name] = attribute;
    return this;
  }

  getAttribute(name: string) {
    return this._attributes[name];
  }

  deleteAttribute(name: string) {
    delete this._attributes[name];
    return this;
  }

  calculateNormals(forceNewAttribute = false) {
    const position = this.getAttribute('position');
    if (!position) return;
    let normal = this.getAttribute('normal');
    if (forceNewAttribute || !normal) {
      normal = new BufferAttribute(new Float32Array(position.data.length), 3);
    } else {
      normal.data.fill(0);
    }

    const indices = this.indices ? this.indices.data : null;
    const posData = position.data;

    let i, j, idx0, idx1, idx2;
    const p0 = new Float32Array(3);
    const p1 = new Float32Array(3);
    const p2 = new Float32Array(3);
    const edge1 = new Float32Array(3);
    const edge2 = new Float32Array(3);
    const n = new Float32Array(3);

    const vertexCount = indices ? indices.length : posData.length / 3;

    for (i = 0; i < vertexCount; i += 3) {
      idx0 = indices ? indices[i] * 3 : i * 3;
      idx1 = indices ? indices[i + 1] * 3 : (i + 1) * 3;
      idx2 = indices ? indices[i + 2] * 3 : (i + 2) * 3;

      for (j = 0; j < 3; j++) {
        p0[j] = posData[idx0 + j];
        p1[j] = posData[idx1 + j];
        p2[j] = posData[idx2 + j];
      }

      for (j = 0; j < 3; j++) {
        edge1[j] = p1[j] - p0[j];
        edge2[j] = p2[j] - p0[j];
      }

      // Compute cross product
      n[0] = edge1[1] * edge2[2] - edge1[2] * edge2[1];
      n[1] = edge1[2] * edge2[0] - edge1[0] * edge2[2];
      n[2] = edge1[0] * edge2[1] - edge1[1] * edge2[0];

      // Normalize the face normal
      const len = Math.sqrt(n[0] * n[0] + n[1] * n[1] + n[2] * n[2]);
      n[0] /= len;
      n[1] /= len;
      n[2] /= len;

      // Add to normals of all vertices of the triangle
      for (j = 0; j < 3; j++) {
        normal.data[idx0 + j] += n[j];
        normal.data[idx1 + j] += n[j];
        normal.data[idx2 + j] += n[j];
      }
    }

    // Normalize the normals
    const count = posData.length / 3;
    for (i = 0; i < count; i++) {
      idx0 = i * 3;
      const len = Math.sqrt(
        normal.data[idx0] ** 2 +
        normal.data[idx0 + 1] ** 2 +
        normal.data[idx0 + 2] ** 2
      );
      normal.data[idx0] /= len;
      normal.data[idx0 + 1] /= len;
      normal.data[idx0 + 2] /= len;
    }

    this.setAttribute('normal', normal);
  }

  calculateTangents(): void {
    const position = this.getAttribute('position');
    const texCoord = this.getAttribute('texCoord');
    const indices = this.indices;
    if (!position || !texCoord || !indices) {
      console.error('Position, texCoord, and indices attributes are required to calculate tangents');
      return;
    }

    const tangents = new Float32Array(position.data.length);

    const posData = position.data;
    const uvData = texCoord.data;
    const indexData = indices.data;

    for (let i = 0; i < indexData.length; i += 3) {
      const i1 = indexData[i];
      const i2 = indexData[i + 1];
      const i3 = indexData[i + 2];

      const v0 = new Vector3(posData[i1 * 3], posData[i1 * 3 + 1], posData[i1 * 3 + 2]);
      const v1 = new Vector3(posData[i2 * 3], posData[i2 * 3 + 1], posData[i2 * 3 + 2]);
      const v2 = new Vector3(posData[i3 * 3], posData[i3 * 3 + 1], posData[i3 * 3 + 2]);

      const uv0 = new Vector3(uvData[i1 * 2], uvData[i1 * 2 + 1], 0);
      const uv1 = new Vector3(uvData[i2 * 2], uvData[i2 * 2 + 1], 0);
      const uv2 = new Vector3(uvData[i3 * 2], uvData[i3 * 2 + 1], 0);

      const deltaPos1 = v1.subtract(v0);
      const deltaPos2 = v2.subtract(v0);

      const deltaUV1 = uv1.subtract(uv0);
      const deltaUV2 = uv2.subtract(uv0);

      const r = 1.0 / (deltaUV1.x * deltaUV2.y - deltaUV1.y * deltaUV2.x);
      const tangent = (deltaPos1.multiply(deltaUV2.y).subtract(deltaPos2.multiply(deltaUV1.y))).multiply(r);

      tangents[i1 * 3] += tangent.x;
      tangents[i1 * 3 + 1] += tangent.y;
      tangents[i1 * 3 + 2] += tangent.z;

      tangents[i2 * 3] += tangent.x;
      tangents[i2 * 3 + 1] += tangent.y;
      tangents[i2 * 3 + 2] += tangent.z;

      tangents[i3 * 3] += tangent.x;
      tangents[i3 * 3 + 1] += tangent.y;
      tangents[i3 * 3 + 2] += tangent.z;
    }

    // Normalize the tangents
    for (let i = 0; i < tangents.length; i += 3) {
      const t = new Vector3(tangents[i], tangents[i + 1], tangents[i + 2]);
      t.normalize();
      tangents[i] = t.x;
      tangents[i + 1] = t.y;
      tangents[i + 2] = t.z;
    }

    this.setAttribute('tangent', new BufferAttribute(tangents, 3));
  }

  calculateCentroid(): Vector3 {
    const position = this.getAttribute('position');
    if (!position)
      throw new Error('Position attribute is required to calculate centroid');

    const posData = position.data;
    const vertexCount = posData.length / position.size;
    const centroid = new Float32Array(3);

    for (let i = 0; i < vertexCount; i++) {
      centroid[0] += posData[i * 3];
      centroid[1] += posData[i * 3 + 1];
      centroid[2] += posData[i * 3 + 2];
    }

    centroid[0] /= vertexCount;
    centroid[1] /= vertexCount;
    centroid[2] /= vertexCount;

    return new Vector3(0, 0, 0);
  }

  to_json(): BufferGeometryJSON {
    const json: BufferGeometryJSON = {
      attributes: {},
    };
  
      for (const attributeName in this._attributes) {
        if (Object.prototype.hasOwnProperty.call(this._attributes, attributeName)) {
          const attribute = this._attributes[attributeName];
          json.attributes[attributeName] = attribute.to_json();
        }
      }
  
      if (this._indices) {
        json.indices = this._indices.to_json();
      }
  
      return json;
  }  

  static from_json(json: BufferGeometryJSON): BufferGeometry {
    const geometry = new BufferGeometry();

    for (const key in json.attributes) {
      const attrJson = json.attributes[key];
      const attribute = BufferAttribute.from_json(attrJson);
      geometry.setAttribute(key, attribute);
    }

    if (json.indices) {
      const indices = BufferAttribute.from_json(json.indices);
      geometry.setIndices(indices);
    }

    return geometry;
  }
}
