export function checkGLError(gl: WebGLRenderingContext) {
  const error = gl.getError();
  if (error !== gl.NO_ERROR) {
    let errorString;
    switch (error) {
      case gl.INVALID_ENUM:
        errorString = 'INVALID_ENUM';
        break;
      case gl.INVALID_VALUE:
        errorString = 'INVALID_VALUE';
        break;
      case gl.INVALID_OPERATION:
        errorString = 'INVALID_OPERATION';
        break;
      case gl.INVALID_FRAMEBUFFER_OPERATION:
        errorString = 'INVALID_FRAMEBUFFER_OPERATION';
        break;
      case gl.OUT_OF_MEMORY:
        errorString = 'OUT_OF_MEMORY';
        break;
      case gl.CONTEXT_LOST_WEBGL:
        errorString = 'CONTEXT_LOST_WEBGL';
        break;
      default:
        errorString = 'UNKNOWN_ERROR';
        break;
    }
    console.error(`WebGL Error: ${errorString} (0x${error.toString(16)})`);
  }
}
