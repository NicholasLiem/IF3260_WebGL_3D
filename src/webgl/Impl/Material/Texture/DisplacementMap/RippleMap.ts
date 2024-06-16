export function generateRippleDisplacement(size = 256, frequency = 5, amplitude = 10): Uint8Array {
    const displacement = new Uint8Array(size * size);
    const centerX = size / 2;
    const centerY = size / 2;
    for (let y = 0; y < size; ++y) {
      for (let x = 0; x < size; ++x) {
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const value = (Math.sin(distance * frequency * Math.PI / size) + 1) / 2;
        displacement[y * size + x] = value * amplitude * 255;
      }
    }
    return displacement;
  }
  