export function generateBrickNormalMap(size = 64, brickWidth = 8, brickHeight = 4): Uint8Array {
    const normalTexels = new Uint8Array(4 * size * size);
    
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const inBrick = ((x % brickWidth < brickWidth - 1) && (y % brickHeight < brickHeight - 1));
        const inMortar = !inBrick;
        
        let nx = 0;
        let ny = 0;
        let nz = 1;
        
        if (inMortar) {
          nx = 0;
          ny = 0;
          nz = 1;
        } else {
          nx = (x % brickWidth < 1 || y % brickHeight < 1) ? -1 : 1;
          ny = (x % brickWidth < 1 || y % brickHeight < 1) ? -1 : 1;
          nz = Math.sqrt(1 - nx * nx - ny * ny);
        }
  
        const idx = 4 * (y * size + x);
        normalTexels[idx] = (nx * 0.5 + 0.5) * 255; // R
        normalTexels[idx + 1] = (ny * 0.5 + 0.5) * 255; // G
        normalTexels[idx + 2] = (nz * 0.5 + 0.5) * 255; // B
        normalTexels[idx + 3] = 255; // A
      }
    }
    
    return normalTexels;
  }
  