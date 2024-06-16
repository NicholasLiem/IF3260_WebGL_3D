type TypedArray =
  | Float32Array
  | Uint8Array
  | Uint16Array
  | Uint32Array
  | Int8Array
  | Int16Array
  | Int32Array;

export interface BufferAttributeJSON {
  data: number[];
  size: number;
  dtype: number;
  normalize: boolean;
  stride: number;
  offset: number;
  isDirty: boolean;
}

export class BufferAttribute {
  private _data: TypedArray;
  private _size: number;
  private _dtype: number;
  private _normalize = false;
  private _stride = 0;
  private _offset = 0;
  private _isDirty = true;

  constructor(
    data: TypedArray,
    size: number,
    options: {
      dtype?: number;
      normalize?: boolean;
      stride?: number;
      offset?: number;
    } = {},
  ) {
    this._data = data;
    this._size = size;
    this._dtype = options.dtype || BufferAttribute.arrayToDtype(data);
    this._normalize = options.normalize || false;
    this._stride = options.stride || 0;
    this._offset = options.offset || 0;
  }

  get data() {
    return this._data;
  }
  get size() {
    return this._size;
  }
  get dtype() {
    return this._dtype;
  }
  get normalize() {
    return this._normalize;
  }
  get stride() {
    return this._stride;
  }
  get offset() {
    return this._offset;
  }
  get isDirty() {
    return this._isDirty;
  }

  set data(data: TypedArray) {
    this._data = data;
    this._isDirty = true;
  }

  set size(size: number) {
    this._size = size;
    this._isDirty = true;
  }
  set dtype(dtype: number) {
    this._dtype = dtype;
    this._isDirty = true;
  }
  set normalize(normalize: boolean) {
    this._normalize = normalize;
    this._isDirty = true;
  }
  set stride(stride: number) {
    this._stride = stride;
    this._isDirty = true;
  }
  set offset(offset: number) {
    this._offset = offset;
    this._isDirty = true;
  }

  /**
   * Tandai buffer sebagai bersih
   * (tidak perlu di-copy kembali ke GPU)
   *
   * Hanya dipanggil pada attribute setter.
   */
  consume() {
    this._isDirty = false;
  }

  /**
   * Jumlah elemen dalam buffer (elemen = data.length / size).
   */
  get count() {
    return this._data.length / this._size;
  }

  /**
   * Panjang dari buffer (data.length = elemen * size).
   */
  get length() {
    return this._data.length;
  }

  set(index: number, data: number[]) {
    this._isDirty = true;
    const dataSize = data.length;
    const dataOffset = index * this._size + this._offset;
    for (let i = 0; i < dataSize; i++) {
      this._data[dataOffset + i] = data[i];
    }
  }

  get(index: number, size?: number) {
    index *= this._size;
    if (!size) size = this._size;
    const data: number[] = [];
    const dataOffset = index + this._offset;
    for (let i = 0; i < size; i++) {
      data.push(this._data[dataOffset + i]);
    }
    return data;
  }

  static arrayToDtype(array: TypedArray) {
    if (typeof WebGLRenderingContext === 'undefined') {
      throw new Error(
        'WebGLRenderingContext is not available in the current environment.',
      );
    }

    if (array instanceof Float32Array) return WebGLRenderingContext.FLOAT;
    if (array instanceof Uint8Array) return WebGLRenderingContext.UNSIGNED_BYTE;
    if (array instanceof Uint16Array)
      return WebGLRenderingContext.UNSIGNED_SHORT;
    if (array instanceof Uint32Array) return WebGLRenderingContext.UNSIGNED_INT;
    if (array instanceof Int8Array) return WebGLRenderingContext.BYTE;
    if (array instanceof Int16Array) return WebGLRenderingContext.SHORT;
    if (array instanceof Int32Array) return WebGLRenderingContext.INT;
    throw new Error('Unsupported data type for buffer attribute');
  }

  to_json(): BufferAttributeJSON {
    return {
      data: Array.from(this._data),
      size: this._size,
      dtype: this._dtype,
      normalize: this._normalize,
      stride: this._stride,
      offset: this._offset,
      isDirty: this._isDirty,
    };
  }

  static from_json(json: BufferAttributeJSON): BufferAttribute {
    let typedArray: TypedArray;
    switch (json.dtype) {
      case WebGLRenderingContext.FLOAT:
        typedArray = new Float32Array(json.data);
        break;
      case WebGLRenderingContext.UNSIGNED_BYTE:
        typedArray = new Uint8Array(json.data);
        break;
      case WebGLRenderingContext.UNSIGNED_SHORT:
        typedArray = new Uint16Array(json.data);
        break;
      case WebGLRenderingContext.UNSIGNED_INT:
        typedArray = new Uint32Array(json.data);
        break;
      case WebGLRenderingContext.BYTE:
        typedArray = new Int8Array(json.data);
        break;
      case WebGLRenderingContext.SHORT:
        typedArray = new Int16Array(json.data);
        break;
      case WebGLRenderingContext.INT:
        typedArray = new Int32Array(json.data);
        break;
      default:
        throw new Error('Unsupported data type for buffer attribute');
    }

    return new BufferAttribute(typedArray, json.size, {
      dtype: json.dtype,
      normalize: json.normalize,
      stride: json.stride,
      offset: json.offset,
    });
  }
}
