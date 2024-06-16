export function generateBrickDisplacementMap(size: number = 64, brickWidth: number = 8, brickHeight: number = 4, mortarDepth: number = 0.1): Uint8Array {
    const displacementTexels = new Uint8Array(size * size);

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            // Check if the current pixel is within a brick or mortar area
            const inBrick = ((x % brickWidth < brickWidth - 1) && (y % brickHeight < brickHeight - 1));
            // Set the value based on whether it's brick or mortar
            const value = inBrick ? 1.0 : mortarDepth;
            // Calculate the index and set the displacement value
            const idx = y * size + x;
            displacementTexels[idx] = value * 255; // Grayscale value for displacement
        }
    }

    return displacementTexels;
}
