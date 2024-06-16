import { Mat4 } from "../Type/Math/Mat4";
import Vector3, { Vector3JSON } from "../Type/Math/Vector3";
import Light, { LightJSON } from "./Light";
import Node from '../Engine/Node';
import Color from "../Type/Color";

export interface PointLightJSON extends LightJSON {
    radius: number;
}

class PointLight extends Light{
    radius: number
    constructor(
        id: number,
        name: string,
        translation = new Vector3(0, 0, 0),
        rotation = new Vector3(0, 0, 0),
        scale = new Vector3(1, 1, 1),
        localMatrix: Mat4 = new Mat4(),
        worldMatrix: Mat4 = new Mat4(),
        parent: Node | null = null,
        color = new Color(255, 255, 255, 1),
        intensity: number = 1.0,
        radius: number = 1.0
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
        this.radius = radius
    }

    getRadius() : number{
      return this.radius;
    }

    setRadius(radius: number) : void{
      this.radius = radius;
    }

    to_json(): PointLightJSON {
        return {
          ...super.to_json(),
          radius: this.radius
        };
      }
    
      static async from_json(json: PointLightJSON): Promise<PointLight> {
        const light = await Light.from_json(json) as Light;
        const radius = json.radius
        return new PointLight(
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
          radius,
        );
      }
}

export default PointLight;