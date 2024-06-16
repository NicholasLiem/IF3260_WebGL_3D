import { Mat4 } from "../Type/Math/Mat4";
import Vector3, { Vector3JSON } from "../Type/Math/Vector3";
import Light, { LightJSON } from "./Light";
import Node from '../Engine/Node';
import Color from "../Type/Color";

export interface DirectionalLightJSON extends LightJSON {
    direction: Vector3JSON;
}

class DirectionalLight extends Light{
    direction: Vector3;
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
        intensity: number = 1.0,
        direction = new Vector3(0, 0, 0)
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
          color,
          intensity
        );
        this.direction = direction
    }

    getDirection() : Vector3{
      return this.direction;
    }

    setDirection(direction : Vector3) : void{
      this.direction = direction;
    }

    to_json(): DirectionalLightJSON {
        return {
          ...super.to_json(),
          direction: this.direction.to_json(),
        };
      }
    
      static async from_json(json: DirectionalLightJSON): Promise<DirectionalLight> {
        const light = await Light.from_json(json) as Light;
        const direction = Vector3.from_json(json.direction);
        return new DirectionalLight(
          light.id,
          light.name,
          light.translation,
          light.rotation,
          light.scale,
          light.localMatrix,
          light.worldMatrix,
          light.parent,
          light.color,
          light.intensity,
          direction,
        );
      }
}

export default DirectionalLight;