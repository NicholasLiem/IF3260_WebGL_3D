import { checkGLError } from '@/app/utils/CheckError';
import { fragmentShaderSource as basicFragmentShaderSource } from './Shaders/Basic/BasicFragmentShaders';
import { vertexShaderSource as basicVertexShaderSource } from './Shaders/Basic/BasicVertexShaders';
import { Texture } from './Impl/Material/Texture';

export const ShaderType = {
  VERTEX: WebGLRenderingContext.VERTEX_SHADER,
  FRAGMENT: WebGLRenderingContext.FRAGMENT_SHADER,
};

interface DrawConfig {
  buffers: {
    positionBuffer: WebGLBuffer | null;
    normalBuffer: WebGLBuffer | null;
    colorBuffer: WebGLBuffer | null;
    indexBuffer: WebGLBuffer | null;
    texCoordBuffer: WebGLBuffer | null;
    tangentBuffer: WebGLBuffer | null;
  };
  viewProjectionMatrix: Float32Array;
  worldMatrix: Float32Array;
  normalMatrix: Float32Array;
  indexCount: number;
  materialColor: Float32Array;
  light: {
    lightPosition: Float32Array;
    lightColor: Float32Array;
    lightDirection: Float32Array;
    lightRadius: number;
  };
  textures: {
    diffuse?: Texture | undefined | null;
    specular?: Texture | undefined | null;
    normal?: Texture | undefined | null;
    displacement?: Texture | undefined | null;
    ambientCoef: number;
    specularCoef: number;
    displacementCoef: number;
  };
  phongProperties: {
    diffuseColor: Float32Array;
    specularColor: Float32Array;
    shininess: number;
  };
  useVertexColor: boolean
}

export class Drawer {
  private gl: WebGLRenderingContext;
  private program: WebGLProgram;
  private attributes: { position: number; normal: number; color: number; texCoord: number; tangent: number; };
  private uniforms: {
    uViewProjectionMatrix: WebGLUniformLocation | null;
    uWorldMatrix: WebGLUniformLocation | null;
    uNormalMatrix: WebGLUniformLocation | null;
    uLightPosition: WebGLUniformLocation | null;
    uLightColor: WebGLUniformLocation | null;
    uLightDirection: WebGLUniformLocation | null;
    uLightRadius: WebGLUniformLocation | null;
    uColor: WebGLUniformLocation | null;
    uUseDiffuseMap: WebGLUniformLocation | null;
    uUseSpecularMap: WebGLUniformLocation | null;
    uUseNormalMap: WebGLUniformLocation | null;
    uUseDisplacementMap: WebGLUniformLocation | null;
    uShininess: WebGLUniformLocation | null;
    uAmbientColor: WebGLUniformLocation | null;
    uDiffuseColor: WebGLUniformLocation | null;
    uSpecularColor: WebGLUniformLocation | null;
    uAmbientCoef: WebGLUniformLocation | null;
    uSpecularCoef: WebGLUniformLocation | null;
    uDisplacementCoef: WebGLUniformLocation | null;
    uUseVertexColor: WebGLUniformLocation | null;
  };

  private texturePool: Map<string, WebGLTexture> = new Map();
  private MAX_TEXTURES: number = 50;

  constructor(
    glContext: WebGLRenderingContext,
    vertexShaderSource: string = basicVertexShaderSource,
    fragmentShaderSource: string = basicFragmentShaderSource,
  ) {
    this.gl = glContext;
    this.program = this.initProgram(vertexShaderSource, fragmentShaderSource);
    this.attributes = this.initAttributes();
    this.uniforms = this.initUniforms();
  }

  public getGL(): WebGLRenderingContext {
    return this.gl;
  }

  public getProgram(): WebGLProgram {
    return this.program;
  }

  public enableDepthTesting() {
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
  }

  public disableDepthTesting() {
    this.gl.disable(this.gl.DEPTH_TEST);
  }

  public clear() {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clearDepth(1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  public clearTexture(texture: WebGLTexture | null) {
    if (texture) {
        this.gl.deleteTexture(texture);
    }
  }

  public prepareToDraw() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
  }

  private initUniforms(): {
    uViewProjectionMatrix: WebGLUniformLocation | null;
    uWorldMatrix: WebGLUniformLocation | null;
    uNormalMatrix: WebGLUniformLocation | null;
    uLightPosition: WebGLUniformLocation | null;
    uLightColor: WebGLUniformLocation | null;
    uLightDirection: WebGLUniformLocation | null;
    uLightRadius: WebGLUniformLocation | null;
    uColor: WebGLUniformLocation | null;
    uUseTexture: WebGLUniformLocation | null;
    uUseDiffuseMap: WebGLUniformLocation | null;
    uUseSpecularMap: WebGLUniformLocation | null;
    uUseNormalMap: WebGLUniformLocation | null;
    uUseDisplacementMap: WebGLUniformLocation | null;
    uShininess: WebGLUniformLocation | null;
    uAmbientColor: WebGLUniformLocation | null;
    uDiffuseColor: WebGLUniformLocation | null;
    uSpecularColor: WebGLUniformLocation | null;
    uAmbientCoef: WebGLUniformLocation | null;
    uSpecularCoef: WebGLUniformLocation | null;
    uDisplacementCoef: WebGLUniformLocation | null;
    uUseVertexColor: WebGLUniformLocation | null;
  } {
    return {
      uViewProjectionMatrix: this.gl.getUniformLocation(this.program, 'uViewProjectionMatrix'),
      uWorldMatrix: this.gl.getUniformLocation(this.program, 'uWorldMatrix'),
      uNormalMatrix: this.gl.getUniformLocation(this.program, 'uNormalMatrix'),
      uLightPosition: this.gl.getUniformLocation(this.program, 'uLightPosition'),
      uLightColor: this.gl.getUniformLocation(this.program, 'uLightColor'),
      uLightDirection: this.gl.getUniformLocation(this.program, 'uLightDirection'),
      uLightRadius: this.gl.getUniformLocation(this.program, 'uLightRadius'),
      uColor: this.gl.getUniformLocation(this.program, 'uColor'),
      uUseTexture: this.gl.getUniformLocation(this.program, 'uUseTexture'),
      uUseDiffuseMap: this.gl.getUniformLocation(this.program, 'uUseDiffuseMap'),
      uUseSpecularMap: this.gl.getUniformLocation(this.program, 'uUseSpecularMap'),
      uUseNormalMap: this.gl.getUniformLocation(this.program, 'uUseNormalMap'),
      uUseDisplacementMap: this.gl.getUniformLocation(this.program, 'uUseDisplacementMap'),
      uShininess: this.gl.getUniformLocation(this.program, 'uShininess'),
      uAmbientColor: this.gl.getUniformLocation(this.program, 'uAmbientColor'),
      uDiffuseColor: this.gl.getUniformLocation(this.program, 'uDiffuseColor'),
      uSpecularColor: this.gl.getUniformLocation(this.program, 'uSpecularColor'),
      uAmbientCoef: this.gl.getUniformLocation(this.program, 'uAmbientCoef'),
      uSpecularCoef: this.gl.getUniformLocation(this.program, 'uSpecularCoef'),
      uDisplacementCoef: this.gl.getUniformLocation(this.program, 'uDisplacementCoef'),
      uUseVertexColor: this.gl.getUniformLocation(this.program, 'uUseVertexColor'),
    };
  }

  private initProgram(
    vertexShaderSource: string,
    fragmentShaderSource: string,
  ): WebGLProgram {
    return this.createProgram(this.createShader(ShaderType.VERTEX, vertexShaderSource), this.createShader(ShaderType.FRAGMENT, fragmentShaderSource));
  }

  public createShader(type: number, source: string): WebGLShader {
    const shader = this.gl.createShader(type);
    if (!shader) throw new Error('Unable to create shader');

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('An error occurred compiling the shaders: ' + this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      throw new Error('Shader failed to compile');
    }

    return shader;
  }

  public createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
    let program = this.gl.createProgram();
    if (!program) throw new Error('Unable to create shader program');

    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error('Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(program));
      this.gl.deleteProgram(program);
      throw new Error('Shader program failed to link');
    }

    return program;
  }

  private initAttributes(): {
    position: number;
    normal: number;
    color: number;
    texCoord: number;
    tangent: number;
  } {
    return {
      position: this.gl.getAttribLocation(this.program, 'aVertexPosition'),
      normal: this.gl.getAttribLocation(this.program, 'aVertexNormal'),
      color: this.gl.getAttribLocation(this.program, 'aVertexColor'),
      texCoord: this.gl.getAttribLocation(this.program, 'aTexCoord'),
      tangent: this.gl.getAttribLocation(this.program, 'aTangent'),
    };
  }

  public initTexture(texture: Texture): WebGLTexture {
    const glTexture = this.gl.createTexture();
    if (!glTexture) throw new Error('Unable to create texture');
  
    this.gl.bindTexture(this.gl.TEXTURE_2D, glTexture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, texture.wrapS);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, texture.wrapT);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, texture.minFilter);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, texture.magFilter);

    function isPowerOfTwo(value: number): boolean {
        return (value & (value - 1)) === 0;
    }

    function nextPowerOfTwo(value: number): number {
        return Math.pow(2, Math.ceil(Math.log2(value)));
    }

    let width = texture.width;
    let height = texture.height;
    let resized = false;

    if (!isPowerOfTwo(width) || !isPowerOfTwo(height)) {
        width = nextPowerOfTwo(width);
        height = nextPowerOfTwo(height);
        resized = true;
    }

    if (texture.isLoaded) {
        if (texture.data instanceof HTMLImageElement) {
            if (resized) {
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(texture.data, 0, 0, width, height);
                    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, canvas);
                }
            } else {
                this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, texture.data);
            }
        } else if (texture.data instanceof Uint8Array) {
            if (resized) {
                const resizedData = new Uint8Array(width * height * 4);
                resizedData.fill(255); // White color
                this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, width, height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, resizedData);
            } else {
                this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, texture.width, texture.height, 0, texture.format, texture.type, texture.data);
            }
        }
    } else {
        const defaultColor = new Uint8Array([
            texture.defaultColor.r * 255,
            texture.defaultColor.g * 255,
            texture.defaultColor.b * 255,
            texture.defaultColor.a * 255,
        ]);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, defaultColor);
    }

    if (texture.minFilter === this.gl.NEAREST_MIPMAP_NEAREST  || 
        texture.minFilter === this.gl.NEAREST_MIPMAP_LINEAR   || 
        texture.minFilter === this.gl.LINEAR_MIPMAP_NEAREST   || 
        texture.minFilter === this.gl.LINEAR_MIPMAP_LINEAR) {
      this.gl.generateMipmap(this.gl.TEXTURE_2D);
    }

    texture._texture = glTexture;
    texture.needsUpload = false;
    return glTexture;
  }

  private manageTexturePool(texture: Texture): WebGLTexture {
    if (this.texturePool.size >= this.MAX_TEXTURES) {
        const oldestTextureKey = this.texturePool.keys().next().value;
        const oldestTexture = this.texturePool.get(oldestTextureKey);
        if (oldestTexture) {
            this.clearTexture(oldestTexture);
        }
        this.texturePool.delete(oldestTextureKey);
    }

    let glTexture = this.texturePool.get(texture.currentSrc);
    if (!glTexture) {
        glTexture = this.initTexture(texture);
        this.texturePool.set(texture.currentSrc, glTexture);
    }

    return glTexture;
  }

  public updateShaders(
    vertexShaderSource: string,
    fragmentShaderSource: string,
  ) {
    const newVertexShader = this.createShader(ShaderType.VERTEX, vertexShaderSource);
    const newFragmentShader = this.createShader(ShaderType.FRAGMENT, fragmentShaderSource);

    const newProgram = this.createProgram(newVertexShader, newFragmentShader);

    this.program = newProgram;

    this.attributes = this.initAttributes();
    this.uniforms = this.initUniforms();
  }

  public setBuffers(
    vertices: Float32Array,
    normals: Float32Array,
    colors: Float32Array,
    indices: Uint16Array,
    texCoords: Float32Array,
    tangents: Float32Array
  ): {
    positionBuffer: WebGLBuffer | null;
    normalBuffer: WebGLBuffer | null;
    colorBuffer: WebGLBuffer | null;
    indexBuffer: WebGLBuffer | null;
    texCoordBuffer: WebGLBuffer | null;
    tangentBuffer: WebGLBuffer | null;
  } {
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

    const normalBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, normals, this.gl.STATIC_DRAW);

    const colorBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, colors, this.gl.STATIC_DRAW);

    const indexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indices, this.gl.STATIC_DRAW);

    const texCoordBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texCoordBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, texCoords, this.gl.STATIC_DRAW);

    const tangentBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, tangentBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, tangents, this.gl.STATIC_DRAW);

    return { positionBuffer, normalBuffer, colorBuffer, indexBuffer, texCoordBuffer, tangentBuffer };
  }

  public draw(config: DrawConfig): void {
    const {
      buffers,
      viewProjectionMatrix,
      worldMatrix,
      normalMatrix,
      indexCount,
      light = { lightPosition: new Float32Array([0, 0, 0]), lightDirection: new Float32Array([0, 0, 0]), lightColor: new Float32Array([1, 1, 1, 1]), lightRadius: 1},
      materialColor = new Float32Array([1, 1, 1, 1]),
      textures,
      phongProperties = { diffuseColor: new Float32Array([1, 1, 1, 1]), specularColor: new Float32Array([1, 1, 1, 1]), shininess: 1 },
      useVertexColor
    } = config;
  
    if (
      buffers.positionBuffer == null ||
      buffers.normalBuffer == null ||
      buffers.colorBuffer == null ||
      buffers.indexBuffer == null ||
      buffers.tangentBuffer == null
    ) {
      throw new Error('Buffer is null');
    }
  
    this.gl.useProgram(this.program);
    // checkGLError(this.gl);
  
    // Position buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.positionBuffer);
    // checkGLError(this.gl);
    this.gl.vertexAttribPointer(this.attributes.position, 3, this.gl.FLOAT, false, 0, 0);
    // checkGLError(this.gl);
    this.gl.enableVertexAttribArray(this.attributes.position);
    // checkGLError(this.gl);
  
    // Normal buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.normalBuffer);
    // checkGLError(this.gl);
    this.gl.vertexAttribPointer(this.attributes.normal, 3, this.gl.FLOAT, false, 0, 0);
    // checkGLError(this.gl);
    this.gl.enableVertexAttribArray(this.attributes.normal);
    // checkGLError(this.gl);

    // Color buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.colorBuffer);
    // checkGLError(this.gl);
    this.gl.vertexAttribPointer(this.attributes.color, 4, this.gl.FLOAT, false, 0, 0);
    // checkGLError(this.gl);
    this.gl.enableVertexAttribArray(this.attributes.color);
    // checkGLError(this.gl);
  
    // Index buffer
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffers.indexBuffer);
    // checkGLError(this.gl);
  
    // Texture buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.texCoordBuffer);
    // checkGLError(this.gl);
    this.gl.vertexAttribPointer(this.attributes.texCoord, 2, this.gl.FLOAT, false, 0, 0);
    // checkGLError(this.gl);
    this.gl.enableVertexAttribArray(this.attributes.texCoord);
    // checkGLError(this.gl);
  
    // Tangent buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.tangentBuffer);
    // checkGLError(this.gl);
    this.gl.vertexAttribPointer(this.attributes.tangent, 3, this.gl.FLOAT, false, 0, 0);
    // checkGLError(this.gl);
    this.gl.enableVertexAttribArray(this.attributes.tangent);
    // checkGLError(this.gl);
  
    // Set projection, view, and model-view matrices uniform
    this.gl.uniformMatrix4fv(this.uniforms.uViewProjectionMatrix, false, viewProjectionMatrix);
    // checkGLError(this.gl);
    this.gl.uniformMatrix4fv(this.uniforms.uWorldMatrix, false, worldMatrix);
    // checkGLError(this.gl);
    this.gl.uniformMatrix3fv(this.uniforms.uNormalMatrix, false, normalMatrix);
    // checkGLError(this.gl);
  
    // Set color uniform
    this.gl.uniform4fv(this.uniforms.uColor, materialColor);
    // checkGLError(this.gl);

    // Set light
    this.gl.uniform3fv(this.uniforms.uLightPosition, light.lightDirection);
    // checkGLError(this.gl);
    this.gl.uniform4fv(this.uniforms.uLightColor, light.lightColor);
    // checkGLError(this.gl);
    this.gl.uniform3fv(this.uniforms.uLightDirection, light.lightDirection);
    // checkGLError(this.gl);
    this.gl.uniform1f(this.uniforms.uLightRadius, light.lightRadius);
    // checkGLError(this.gl);
  
    // Set shininess uniform
    this.gl.uniform1f(this.uniforms.uShininess, phongProperties.shininess);
    // checkGLError(this.gl);
  
    this.gl.uniform4fv(this.uniforms.uAmbientColor, materialColor);
    this.gl.uniform1f(this.uniforms.uAmbientCoef, textures.ambientCoef);
    this.gl.uniform4fv(this.uniforms.uDiffuseColor, phongProperties.diffuseColor);
    this.gl.uniform4fv(this.uniforms.uSpecularColor, phongProperties.specularColor);

    this.gl.uniform1i(this.uniforms.uUseVertexColor, useVertexColor ? 1 : 0);
  
    if (textures.diffuse) {
      const glTexture = this.manageTexturePool(textures.diffuse);
      this.gl.activeTexture(this.gl.TEXTURE0);
      // checkGLError(this.gl);
      this.gl.bindTexture(this.gl.TEXTURE_2D, glTexture);
      // checkGLError(this.gl);
      this.gl.uniform1i(this.uniforms.uUseDiffuseMap, 1);
      this.gl.uniform1i(this.gl.getUniformLocation(this.program, 'uDiffuseMap'), 0);
      // checkGLError(this.gl);
    } else {
      this.gl.uniform1i(this.uniforms.uUseDiffuseMap, 0);
      // checkGLError(this.gl);
    }
  
    if (textures.specular) {
      const glTexture = this.manageTexturePool(textures.specular);
      this.gl.activeTexture(this.gl.TEXTURE1);
      // checkGLError(this.gl);
      this.gl.bindTexture(this.gl.TEXTURE_2D, glTexture);
      // checkGLError(this.gl);
      this.gl.uniform1f(this.uniforms.uSpecularCoef, textures.specularCoef);
      this.gl.uniform1i(this.uniforms.uUseSpecularMap, 1);
      this.gl.uniform1i(this.gl.getUniformLocation(this.program, 'uSpecularMap'), 1);
      // checkGLError(this.gl);
    } else {
      this.gl.uniform1i(this.uniforms.uUseSpecularMap, 0);
      // checkGLError(this.gl);
    }

    if (textures.normal) {
      const glTexture = this.manageTexturePool(textures.normal);
      this.gl.activeTexture(this.gl.TEXTURE1);
      // checkGLError(this.gl);
      this.gl.bindTexture(this.gl.TEXTURE_2D, glTexture);
      // checkGLError(this.gl);
      this.gl.uniform1i(this.uniforms.uUseNormalMap, 1);
      this.gl.uniform1i(this.gl.getUniformLocation(this.program, 'uNormalMap'), 2);
      // checkGLError(this.gl);
    } else {
      this.gl.uniform1i(this.uniforms.uUseNormalMap, 0);
      // checkGLError(this.gl);
    }
  
    if (textures.displacement) {
      const glTexture = this.manageTexturePool(textures.displacement);
      this.gl.activeTexture(this.gl.TEXTURE3);
      // checkGLError(this.gl);
      this.gl.bindTexture(this.gl.TEXTURE_2D, glTexture);
      // checkGLError(this.gl);
      this.gl.uniform1f(this.uniforms.uDisplacementCoef, textures.displacementCoef);
      this.gl.uniform1i(this.uniforms.uUseDisplacementMap, 1);
      this.gl.uniform1i(this.gl.getUniformLocation(this.program, 'uDisplacementMap'), 3);
      // checkGLError(this.gl);
    } else {
      this.gl.uniform1i(this.uniforms.uUseDisplacementMap, 0);
      // checkGLError(this.gl);
    }
  
    this.gl.drawElements(this.gl.TRIANGLES, indexCount, this.gl.UNSIGNED_SHORT, 0);
    // checkGLError(this.gl);
  }

  public resizeCanvasToDisplaySize(canvas: HTMLCanvasElement) {
    const dpr = window.devicePixelRatio;
    const displayWidth = Math.round(canvas.clientWidth * dpr);
    const displayHeight = Math.round(canvas.clientHeight * dpr);

    const needResize =
      canvas.width !== displayWidth || canvas.height !== displayHeight;

    if (needResize) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
    }
  }
}
