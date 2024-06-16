import LightInterface from "@/webgl/Interfaces/Engine/LightInterface";
import Vector3, { Vector3JSON } from "../Type/Math/Vector3";
import { Mat4 } from "../Type/Math/Mat4";
import Node, { NodeJSON } from '../Engine/Node';
import Color from "../Type/Color";


export interface LightJSON extends NodeJSON {
    color: string;
    intensity: number;
}

class Light extends Node implements LightInterface{
    color: Color;
    intensity: number;
    constructor(
        id: number,
        name: string,
        translation = new Vector3(0, 0, 0),
        rotation = new Vector3(0, 0, 0),
        scale = new Vector3(1, 1, 1),
        localMatrix: Mat4 = new Mat4(),
        worldMatrix: Mat4 = new Mat4(),
        parent: Node | null = null,
        color = new Color(1, 1, 1, 1),
        intensity: number,
    ) {
        super(
          id,
          name,
          translation,
          rotation,
          scale,
          localMatrix,
          worldMatrix,
          parent,
        );
        this.color = color;
        this.intensity = intensity;
    }

    getColor(): Color {
        return this.color;
    }

    setColor(color: Color): void {
        this.color = color;
    }

    getIntensity(): number {
        return this.intensity;
    }

    setIntensity(intensity: number): void {
        this.intensity = intensity;
    }

    dispose() {

		// Empty in base class;

	}



    to_json(): LightJSON {
        const nodeJson = super.to_json();
        return {
          ...nodeJson,
          color: this.color.to_json(),
          intensity: this.intensity
        };
    }
    static async from_json(json: LightJSON): Promise<Light> {
        const translation = Vector3.from_json(json.translation);
        const rotation = Vector3.from_json(json.rotation);
        const scale = Vector3.from_json(json.scale);
        const localMatrix = Mat4.from_json(json.localMatrix);
        const worldMatrix = Mat4.from_json(json.worldMatrix);
        const color = Color.from_json(json.color);

        const light = new Light(
            json.id,
            json.name,
            translation,
            rotation,
            scale,
            localMatrix,
            worldMatrix,
            null, // Parent will be set separately if needed
            color,
            json.intensity,
        );

        // If the JSON includes children, add them to the light node
        for (const childJson of json.children) {
            const childNode = await Node.from_json(childJson);
            childNode.setParent(light);
        }

        return light;
    }
}

export default Light;
