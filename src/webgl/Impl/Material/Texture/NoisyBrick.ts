export function generateNoiseNormalTexture(size = 64): Uint8Array {
    const texels = new Uint8Array(4 * size * size);
    for (let i = 0; i < size * size; ++i) {
      const idx = 4 * i;
      const value = Math.random() * 255;
  
      texels[idx] = texels[idx + 1] = texels[idx + 2] = value;
      texels[idx + 3] = 255; // Alpha channel
    }
    return texels;
  }
  