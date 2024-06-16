export function generateBumpNormalTexture(size = 64): Uint8Array {
    const texels = new Uint8Array(4 * size * size);
  
    for (let y = 0; y < size; ++y) {
      for (let x = 0; x < size; ++x) {
        const idx = 4 * (y * size + x);
        const height = (Math.sin(x * 0.1) + Math.sin(y * 0.1)) * 0.5 + 0.5;
  
        texels[idx] = height * 255;
        texels[idx + 1] = height * 255;
        texels[idx + 2] = height * 255;
        texels[idx + 3] = 255; // Alpha channel
      }
    }
    return texels;
  }
  