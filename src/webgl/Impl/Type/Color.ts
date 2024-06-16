import ColorInterface from '@/webgl/Interfaces/Types/ColorInterface';

class Color implements ColorInterface {
  constructor(
    public readonly r: number,
    public readonly g: number,
    public readonly b: number,
    public readonly a: number = 1.0,
  ) {}

  public getRGB(): readonly [number, number, number] {
    return [this.r, this.g, this.b];
  }

  static fromHex(hex: number): Color {
    const r = (hex >> 16) & 0xff;
    const g = (hex >> 8) & 0xff;
    const b = hex & 0xff;
    return new Color(r / 255, g / 255, b / 255);
  }

  static white(): Color {
    return new Color(1.0, 1.0, 1.0);
  }

  public toArray(): [number, number, number, number] {
    return [this.r, this.g, this.b, this.a];
  }

  [Symbol.iterator](): Iterator<number> {
    let index = 0;
    const values = [this.r, this.g, this.b, this.a];
    return {
      next: () => {
        if (index < values.length) {
          return { value: values[index++], done: false };
        } else {
          return { value: undefined, done: true };
        }
      },
    };
  }

  to_json(): string {
    return JSON.stringify({ r: this.r, g: this.g, b: this.b, a: this.a });
  }

  static from_json(json: string): Color {
    const data = JSON.parse(json);
    return new Color(data.r, data.g, data.b, data.a);
  }
}

export default Color;
