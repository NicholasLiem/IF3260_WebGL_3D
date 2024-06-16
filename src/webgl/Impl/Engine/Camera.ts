import CameraInterface, {
  CameraType,
} from '../../Interfaces/Engine/CameraInterface';
import Point, { PointJSON } from '../Type/Point';
import { Mat4 } from '../Type/Math/Mat4';
import Node, { NodeJSON } from './Node';
import Vector3 from '../Type/Math/Vector3';
import { Mat3 } from '../Type/Math/Mat3';

export interface CameraJSON extends NodeJSON {
  radius: number;
  angle: number;
  center: PointJSON;
  type: string;
}

class Camera extends Node implements CameraInterface {
  public radius: number;
  public angle: number;
  public center: Point;
  public _type: CameraType;
  private viewMatrix: Mat4;
  private projectionMatrix: Mat4;
  private canvasWidth: number = 2;
  private canvasHeight: number = 1;
  private onChange: (() => void) | null = null;

  public constructor(
    id: number,
    name: string,
    radius: number,
    angle: number,
    center: Point,
    _type: CameraType,
    translation = new Vector3(0, 0, 0),
    rotation = new Vector3(0, 0, 0),
    scale = new Vector3(1, 1, 1),
    localMatrix: Mat4 = new Mat4(),
    worldMatrix: Mat4 = new Mat4(),
    parent: Node | null = null,
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
    this.radius = radius;
    this.angle = angle;
    this.center = center;
    this._type = _type;
    this.viewMatrix = new Mat4();
    this.projectionMatrix = new Mat4();
    this.updateViewMatrix();
    this.updateProjectionMatrix();
  }

  get type(): CameraType {
    return this._type;
  }

  set type(value: CameraType) {
    if (this._type !== value) {
      this._type = value;
      this.translation = new Vector3(0, 0, 0);
      this.rotation = new Vector3(0, 0, 0);
      this.scale = new Vector3(1, 1, 1);
      this.localMatrix = new Mat4(); // Reset localMatrix when type changes
      this.worldMatrix = new Mat4();
      this.viewMatrix = new Mat4();
      this.projectionMatrix = new Mat4();
      this.updateViewMatrix();
      this.updateProjectionMatrix();
    }
  }

  public setOnChange(callback: () => void) {
    this.onChange = callback;
  }

  public setAngle(angle: number): void {
    this.angle = angle * (Math.PI / 180);
    this.updateViewMatrix();
  }
  public rotateY(angle: number): void {
    this.rotation.y += angle * (Math.PI / 180);
    this.updateViewMatrix();
    this.updateProjectionMatrix();
  }

  public rotateX(angle: number): void {
    this.rotation.x += angle * (Math.PI / 180);
    this.updateViewMatrix();
  }

  public translateX(x: number): void {
    this.center.x = x;
    this.updateViewMatrix();
  }

  public translateY(y: number): void {
    this.center.y = y;
    this.updateViewMatrix();
  }

  public zoom(distance: number): void {
    this.radius = distance;
    if (this.type == CameraType.Perspective){
      this.updateViewMatrix();
    }
    else{
      this.updateProjectionMatrix();
    }
  }

  public getModelViewMatrix(worldMatrix: Float32Array): Float32Array {
    const modelViewMatrix = new Float32Array(16);
    Mat4.multiply(modelViewMatrix, this.viewMatrix.elements, worldMatrix);
    return modelViewMatrix;
  }

  public getNormalMatrix(modelViewMatrix: Float32Array): Float32Array {
    const normalMatrix = new Mat3();
    Mat3.normalFromMat4(normalMatrix, modelViewMatrix);
    return normalMatrix.elements;
  }   

  private updateViewMatrix(): void {
    let eye = new Vector3(0, 0, this.radius);
    let target = new Vector3(
      this.worldMatrix.elements[12],
      this.worldMatrix.elements[13],
      this.worldMatrix.elements[14],
    );
    let up = new Vector3(0, 1, 0);

    let viewMatrix = Mat4.create();
    // Ini eye harus pake quaternion dulu. rotate semua.
    eye = Vector3.rotateY(eye, this.angle + this.rotation.y);
    eye = Vector3.rotateX(eye, this.rotation.x);
    Mat4.lookAt(viewMatrix, eye, target, up);
    this.viewMatrix.elements = viewMatrix;
  

    if (this.onChange) {
      this.onChange();
    }
  }

  public setCanvas(widht: number, height: number): void {
    this.canvasWidth = widht;
    this.canvasHeight = height;
  }

  public setType(type: CameraType): void {
    this.type = type;
    if (type == CameraType.Perspective){
      this.updateViewMatrix();
    }
    this.updateProjectionMatrix();
  }

  public updateProjectionMatrix(): void {
    var near = -100;
    var far = 100;
    var wScale = 2;
    var hScale = 4;
    var left = -this.radius/wScale;
    var right = this.radius/wScale;
    var bottom = -this.radius/hScale;
    var top = this.radius/hScale;
    switch (this.type) {
      case CameraType.Perspective:
        const aspect = this.canvasWidth / this.canvasHeight;
        near = 0.1;
        far = 1000.0;
        Mat4.perspective(
          this.projectionMatrix.elements,
          Math.PI / 4,
          aspect,
          near,
          far,
        );
        break;
      case CameraType.Orthographic:
        Mat4.orthographic(
          this.projectionMatrix.elements,
          right,
          left,
          top,
          bottom,
          near,
          far,
        );

        break;
      case CameraType.Oblique:
        Mat4.oblique(
          this.projectionMatrix.elements,
          right,
          left,
          top,
          bottom,
          near,
          far,
          this.rotation.y
        );
        break;
    }
    if (this.onChange) {
      this.onChange();
    }
  }

  public getViewMatrix(): Float32Array {
    return this.viewMatrix.elements;
  }

  public getProjectionMatrix(): Float32Array {
    return this.projectionMatrix.elements;
  }

  public getViewProjectionMatrix(): Float32Array {
    let temp = Mat4.create();
    Mat4.multiplyTranspose(
      temp,
      this.getProjectionMatrix(),
      this.getViewMatrix(),
    );
    return temp;
  }

  to_json(): CameraJSON {
    const nodeJson = super.to_json();
    return {
      ...nodeJson,
      radius: this.radius,
      angle: this.angle,
      center: this.center.to_json(),
      type: this._type,
    };
  }

  static async from_json(json: CameraJSON): Promise<Camera> {
    const center = Point.from_json(json.center);

    const typeKey = json.type as keyof typeof CameraType;
    if (!(typeKey in CameraType)) {
      throw new Error(`Invalid CameraType: ${json.type}`);
    }

    const type = CameraType[typeKey];

    const translation = Vector3.from_json(json.translation);
    const rotation = Vector3.from_json(json.rotation);
    const scale = Vector3.from_json(json.scale);
    const localMatrix = Mat4.from_json(json.localMatrix);
    const worldMatrix = Mat4.from_json(json.worldMatrix);

    const camera = new Camera(
      json.id,
      json.name,
      json.radius,
      json.angle,
      center,
      type,
      translation,
      rotation,
      scale,
      localMatrix,
      worldMatrix,
      null,
    );
    return camera;
  }
}

export default Camera;
