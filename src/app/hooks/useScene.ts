import { useState, useRef, useEffect } from 'react';
import Scene from '@/webgl/Impl/Scene/Scene';
import Node from '@/webgl/Impl/Engine/Node';
import Vector3 from '@/webgl/Impl/Type/Math/Vector3';
import Mesh from '@/webgl/Impl/Mesh/Mesh';
import Camera from '@/webgl/Impl/Engine/Camera';
import { CameraType } from '@/webgl/Interfaces/Engine/CameraInterface';
import Point from '@/webgl/Impl/Type/Point';
import { BasicMaterial } from '@/webgl/Impl/Material/BasicMaterial';
import Color from '@/webgl/Impl/Type/Color';
import { BoxGeometry } from '@/webgl/Impl/Geometry/Objects/Solid/BoxGeometry';
import { HollowOctahedronGeometry } from '@/webgl/Impl/Geometry/Objects/Hollow/HollowOctahedronGeometry';
import { CylinderGeometry } from '@/webgl/Impl/Geometry/Objects/Solid/CylinderGeometry';
import AnimationRunner from "@/webgl/Impl/Animation/AnimationRunner";
import TranslationKeyFrameTrack from "@/webgl/Impl/Animation/TranslationKeyFrameTack";
import { EasingType } from "@/webgl/Utils/EasingFunction";
import { AnimationClip } from "@/webgl/Impl/Animation/AnimationClip";
import Vec3KeyFrame from "@/webgl/Impl/Animation/base/Vec3KeyFrame";
import QuaternionKeyFrame from '@/webgl/Impl/Animation/base/QuatenionKeyFrame';
import QuaternionKeyFrameTrack from '@/webgl/Impl/Animation/QuatenionKeyFrameTrack';
import AmbientLight from '@/webgl/Impl/Light/AmbientLight';
import { Mat4 } from '@/webgl/Impl/Type/Math/Mat4';
import Light from '@/webgl/Impl/Light/Light';
import DirectionalLight from '@/webgl/Impl/Light/DirectionalLight';
import { PhongMaterial } from '@/webgl/Impl/Material/PhongMaterial';
import { SphereGeometry } from '@/webgl/Impl/Geometry/Objects/Solid/SphereGeometry';
import { MagFilter, MinFilter, Texture, WrapMode } from '@/webgl/Impl/Material/Texture';
import { generateBrickNormalMap } from '@/webgl/Impl/Material/Texture/NormalMap/Brick';
import { generateNoiseNormalTexture } from '@/webgl/Impl/Material/Texture/NoisyBrick';
import { generateBumpNormalTexture } from '@/webgl/Impl/Material/Texture/NormalMap/BumpPattern';
import { generateSimpleDisplacementMap } from '@/webgl/Impl/Material/Texture/DisplacementMap/SimpleDisplacementMap';
import { generateRippleDisplacement } from '@/webgl/Impl/Material/Texture/DisplacementMap/RippleMap';
import { generateBrickDisplacementMap } from '@/webgl/Impl/Material/Texture/DisplacementMap/BrickDisplacement';
import { ConeGeometry } from '@/webgl/Impl/Geometry/Objects/Solid/ConeGeometry';
import { PlaneGeometry } from '@/webgl/Impl/Geometry/Objects/Solid/PlaneGeometry';
import PointLight from '@/webgl/Impl/Light/PointLight';
import { HollowTesseractGeometry } from '@/webgl/Impl/Geometry/Objects/Hollow/HollowTesseractGeometry';
import { HollowTrianglePrism } from '@/webgl/Impl/Geometry/Objects/Hollow/HollowTrianglePrism';
import { HollowBoxGeometry } from '@/webgl/Impl/Geometry/Objects/Hollow/HollowBoxGeometry';


export const useScene = (setRootNode: (node: Node) => void) => {
  const [scene, setScene] = useState<Scene | null>(null);
  const [camera, setCamera] = useState<Camera | null>(null);
  const [light, setLight] = useState<Light | null>(null);
  const [animationRunner, setAnimationRunner] = useState<AnimationRunner | null>(null);
  const initializedRef = useRef(false);


  const Box2 = () => {
    const mainScene = new Node(
      0,
      'Box Scene',
      new Vector3(0, 0, 0),
      new Vector3(0, 0, 0),
      new Vector3(1, 1, 1),
    );
    const createScene = new Scene(mainScene);

    const newCamera = new Camera(
      1,
      'Main Camera',
      5,
      0,
      new Point(0, 0, -5),
      CameraType.Orthographic,
    );
    newCamera.setParent(mainScene);


    // Box
    const boxMaterial = new BasicMaterial({
      color: Color.fromHex(0x00fff0),
    });
    const box = new Mesh(
      2,
      'Box',
      new BoxGeometry(1, 1, 1),
      boxMaterial,
    );
    box.setParent(mainScene);

    // Light

    const lighting = new AmbientLight(
      3, // id
      'Ambient Light', // name
      new Vector3(0, 0, 0), // Translation
      new Vector3(0, 0, 0), // rotation
      new Vector3(1, 1, 1), // scale
      new Mat4(), // localMatrix
      new Mat4(), // worldMatrix
      null, // parent
      new Color(1, 1, 0, 1),
      1
    )

    lighting.setParent(mainScene);
    setCamera(newCamera);
    setScene(createScene);
    setRootNode(mainScene); 
  }
  const WindMill = () => {
    const mainScene = new Node(
      0,
      'Scene WindMill Model',
      new Vector3(0, 0, 0),
      new Vector3(0, 0, 0),
      new Vector3(1, 1, 1),
    );
    const createScene = new Scene(mainScene);

    const newCamera = new Camera(
      1,
      'Main Camera',
      5,
      0,
      new Point(0, 0, 0),
      CameraType.Perspective,
    );
    newCamera.setParent(mainScene);

    setCamera(newCamera);
    setScene(createScene);

    // Main Structure

    const emptyMaterial = new BasicMaterial({ color: Color.fromHex(0x00fff0) });
    const mainBody = new Mesh(
      2,
      'Whole Body',
      new BoxGeometry(0, 0, 0),
      emptyMaterial,
    );
    mainBody.setParent(mainScene);

    // Tower Body
    const towerBodyMaterial = new BasicMaterial({
      color: Color.fromHex(0xD2B48C),
    });
    const towerBody = new Mesh(
      3,
      'Tower Body',
      new CylinderGeometry(0.5, 0.8, 4),
      towerBodyMaterial,
    );
    towerBody.setParent(mainBody);

    // Mill Attacher

    const millAttachMaterial = new BasicMaterial({
      color: Color.fromHex(0x8B0000),
    });
    const millAttacher = new Mesh(
      4,
      'Mill Attacher',
      new BoxGeometry(0.2, 0.2, 1),
      millAttachMaterial,
      new Vector3(0, 1.5, 0.3),
    );
    millAttacher.setParent(mainBody);
    // Main Mill Core
    const mainMillMaterial = new BasicMaterial({
      color: Color.fromHex(0xA9A9A9),
    });
    const mainMill = new Mesh(
      5,
      'Main Mill',
      new BoxGeometry(0.4, 0.4, 0.5),
      mainMillMaterial,
      new Vector3(0, 1.5, 1),
    );
    mainMill.setParent(mainBody);

    // 1st Blade
    const firstBladeMaterial = new BasicMaterial({
      color: Color.fromHex(0xFFFFE0),
    });
    const firstBlade = new Mesh(
      6,
      'Left Blade',
      new BoxGeometry(2, 0.4, 0.3),
      firstBladeMaterial,
      new Vector3(-1.2, 0, 0),
    );
    firstBlade.setParent(mainMill);
    // 2nd Blade
    const secondBladeMaterial = new BasicMaterial({
      color: Color.fromHex(0xFFFFE0),
    });
    const secondBlade = new Mesh(
      7,
      'Top Blade',
      new BoxGeometry(0.4, 2, 0.3),
      secondBladeMaterial,
      new Vector3(0, 1.2, 0),
    );
    secondBlade.setParent(mainMill);

    // 3rd Blade
    const thirdBladeMaterial = new BasicMaterial({
      color: Color.fromHex(0xFFFFE0),
    });
    const thirdBlade = new Mesh(
      8,
      'Bottom Blade',
      new BoxGeometry(2, 0.4, 0.3),
      thirdBladeMaterial,
      new Vector3(1.2, 0, 0),
    );
    thirdBlade.setParent(mainMill);
    // 4th Blade

    const fourthBladeMaterial = new BasicMaterial({
      color: Color.fromHex(0xFFFFE0),
    });
    const fourthBlade = new Mesh(
      9,
      'Bottom Blade',
      new BoxGeometry(0.4, 2, 0.3),
      fourthBladeMaterial,
      new Vector3(0, -1.2, 0),
    );
    fourthBlade.setParent(mainMill);

    const lights = new DirectionalLight(
      10,
      'Directional Light',
      new Vector3(0, 0, 0),
      new Vector3(0, 0, 0),
      new Vector3(1, 1, 1),
      new Mat4(),
      new Mat4(),
      null,
      new Color(1, 1, 1, 1),
      0.1,
      new Vector3(1, 1, 1)
    )
    lights.setParent(mainScene);
    setLight(lights);
    
    const animationClip = new AnimationClip("Animasi Windmill", 9);
    const track = new QuaternionKeyFrameTrack("Whole Body.Main Mill", [
      QuaternionKeyFrame.fromEuler(0, 0, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(1, 0, 0, 40, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(2, 0, 0, 80, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(3, 0, 0, 120, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(4, 0, 0, 160, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(5, 0, 0, 200, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(6, 0, 0, 240, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(7, 0, 0, 280, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(8, 0, 0, 320, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(9, 0, 0, 360, EasingType.inOutSine),
    ]);
    animationClip.addTrack(track);
    const animationRunner = new AnimationRunner(animationClip, createScene, { fps: 1 });
    animationRunner.isPlaying = true;
    animationRunner.isReverse = false;
    
    setAnimationRunner(animationRunner);
    setRootNode(mainScene)
  };

  const initializeScene = () => {
    const emptyNode = new Node(
      0,
      'Scene 0',
      new Vector3(0, 0, 0),
      new Vector3(0, 0, 0),
      new Vector3(1, 1, 1),
    );
    const emptyScene = new Scene(emptyNode);
    const meshChildMaterial = new BasicMaterial({
      color: new Color(1.0, 0.0, 0.0),
    });
    const meshChildTwoMaterial = new BasicMaterial({
      color: Color.fromHex(0x00fff0),
    });
    const meshChild = new Mesh(1, 'Tes', new BoxGeometry(), meshChildMaterial);
    const meshChild2 = new Mesh(
      3,
      'Tes2',
      new HollowOctahedronGeometry(),
      meshChildTwoMaterial,
    );
    meshChild.setParent(emptyNode);
    meshChild2.setParent(meshChild);

    const newCamera = new Camera(
      2,
      'Main Camera',
      5,
      0,
      new Point(5, 0, 0),
      CameraType.Perspective,
    );
    newCamera.setParent(emptyNode);

    const track = new TranslationKeyFrameTrack("Tes", [
      new Vec3KeyFrame(0, new Vector3(0, 0, 0), EasingType.outElastic),
      new Vec3KeyFrame(3, new Vector3(0, 0, 3), EasingType.outSine),
    ]);
    const track2 = new TranslationKeyFrameTrack("Tes.Tes2", [
      new Vec3KeyFrame(0, new Vector3(0, 0, -2), EasingType.outExpo),
      new Vec3KeyFrame(3, new Vector3(0, 3, -2), EasingType.outSine),
    ]);
    const animationClip = new AnimationClip("Test", 3);
    animationClip.addTrack(track); 
    animationClip.addTrack(track2);
    const animationRunner = new AnimationRunner(animationClip, emptyScene, { fps: 1 });
    animationRunner.isPlaying = true;
    animationRunner.isReverse = false;

    setAnimationRunner(animationRunner);
    setCamera(newCamera);
    setScene(emptyScene);
    setRootNode(emptyNode);
  };

  const HumanModel = () => {
    const mainScene = new Node(
      0,
      'Scene Human Model',
      new Vector3(0, 0, 0),
      new Vector3(0, 0, 0),
      new Vector3(1, 1, 1),
    );
    const createScene = new Scene(mainScene);

    const newCamera = new Camera(
      1,
      'Main Camera',
      5,
      0,
      new Point(0, 0, 0),
      CameraType.Perspective,
    );
    newCamera.setParent(mainScene);

    setCamera(newCamera);
    setScene(createScene);

    // Main structure
    const emptyMaterial = new BasicMaterial({ color: Color.fromHex(0x00fff0) });
    const mainBody = new Mesh(
      2,
      'Whole Body',
      new BoxGeometry(0, 0, 0),
      emptyMaterial,
    );
    const bodyMaterial = new BasicMaterial({ color: Color.fromHex(0xADD8E6) });
    const body = new Mesh(
      3,
      'Body',
      new BoxGeometry(1, 1.2, 0.7),
      bodyMaterial,
    );
    const headMaterial = new BasicMaterial({ color: Color.fromHex(0xFFDAB9) });
    const head = new Mesh(
      4,
      'Head',
      new BoxGeometry(0.4, 0.5, 0.5),
      headMaterial,
      new Vector3(0, 0.6, 0),
    );
    const rightArmMaterial = new BasicMaterial({
      color: Color.fromHex(0x90EE90),
    });
    //Right Arm Joint
    const rightArmJoint = new Mesh(
      5,
      'Right Arm Joint',
      new BoxGeometry(0, 0, 0),
      emptyMaterial,
      new Vector3(0.6, 0.4, 0),
    );
    //Right Arm
    const rightArm = new Mesh(
      5,
      'Right Arm',
      new BoxGeometry(0.2, 0.6, 0.2),
      rightArmMaterial,
      new Vector3(0, -0.2, 0),
      new Vector3(180, 0, 0),
    );
    const leftArmMaterial = new BasicMaterial({
      color: Color.fromHex(0x90EE90),
    });
    //Left Arm Joint
    const leftArmJoint = new Mesh(
      6,
      'Left Arm Joint',
      new BoxGeometry(0, 0, 0),
      emptyMaterial,
      new Vector3(-0.6, 0.4, 0),
    );
    //Left Arm
    const leftArm = new Mesh(
      6,
      'Left Arm',
      new BoxGeometry(0.2, 0.6, 0.2),
      leftArmMaterial,
      new Vector3(0, -0.2, 0),
      new Vector3(180, 0, 0),
    );
    //Right Leg Joint
    const rightLegJoint = new Mesh(
      7,
      'Right Leg Joint',
      new BoxGeometry(0, 0, 0),
      emptyMaterial,
      new Vector3(0.3, -0.5, 0),
    );
    //Right Leg
    const rightLegMaterial = new BasicMaterial({
      color: Color.fromHex(0x00008B),
    });
    const rightLeg = new Mesh(
      7,
      'Right Leg',
      new BoxGeometry(0.2, 0.6, 0.2),
      rightLegMaterial,
      new Vector3(0, -0.2, 0),
      new Vector3(180, 0, 0),
    );
    //Left Leg Joint
    const leftLegJoint = new Mesh(
      8,
      'Left Leg Joint',
      new BoxGeometry(0, 0, 0),
      emptyMaterial,
      new Vector3(-0.3, -0.5, 0),
    );
    //Left Leg
    const leftLegMaterial = new BasicMaterial({
      color: Color.fromHex(0x00008B),
    });
    const leftLeg = new Mesh(
      8,
      'Left Leg',
      new BoxGeometry(0.2, 0.6, 0.2),
      leftLegMaterial,
      new Vector3(0, -0.2, 0),
      new Vector3(180, 0, 0),
    );

    mainBody.setParent(mainScene);
    body.setParent(mainBody);
    head.setParent(body);
    rightArmJoint.setParent(body);
    rightArm.setParent(rightArmJoint);
    leftArmJoint.setParent(body);
    leftArm.setParent(leftArmJoint);
    leftLegJoint.setParent(body);
    leftLeg.setParent(leftLegJoint);
    rightLegJoint.setParent(body);
    rightLeg.setParent(rightLegJoint);

    const lights = new DirectionalLight(
      13,
      'Directional Light',
      new Vector3(0, 0, 0),
      new Vector3(0, 0, 0),
      new Vector3(1, 1, 1),
      new Mat4(),
      new Mat4(),
      null,
      new Color(1, 1, 1, 1),
      0.1,
      new Vector3(1, 1, 1)
    )
    lights.setParent(mainScene);
    setLight(lights);

    const animationClip = new AnimationClip("Animasi Human", 24);
    const track = new QuaternionKeyFrameTrack("Whole Body.Body.Left Arm Joint", [
      QuaternionKeyFrame.fromEuler(0, 0, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(2, 0, 0, 30, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(4, 0, 0, 60, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(6, 0, 0, 90, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(8, 0, 0, 120, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(10, 0, 0, 150, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(12, 0, 0, 180, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(14, 0, 0, 150, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(16, 0, 0, 120, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(18, 0, 0, 90, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(20, 0, 0, 60, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(22, 0, 0, 30, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(24, 0, 0, 0, EasingType.inOutSine),
    ]);
    const track1 = new QuaternionKeyFrameTrack("Whole Body.Body.Right Arm Joint", [
      QuaternionKeyFrame.fromEuler(0, 0, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(2, 0, 0, -30, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(4, 0, 0, -60, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(6, 0, 0, -90, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(8, 0, 0, -120, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(10, 0, 0, -150, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(12, 0, 0, -180, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(14, 0, 0, -150, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(16, 0, 0, -120, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(18, 0, 0, -90, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(20, 0, 0, -60, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(22, 0, 0, -30, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(24, 0, 0, 0, EasingType.inOutSine),
    ]);
    const track2 = new QuaternionKeyFrameTrack("Whole Body.Body.Left Leg Joint", [
      QuaternionKeyFrame.fromEuler(0, 0, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(2, 0, 0, 10, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(4, 0, 0, 20, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(6, 0, 0, 30, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(8, 0, 0, 40, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(10, 0, 0, 50, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(12, 0, 0, 60, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(14, 0, 0, 50, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(16, 0, 0, 40, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(18, 0, 0, 30, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(20, 0, 0, 20, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(22, 0, 0, 10, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(24, 0, 0, 0, EasingType.inOutSine),
    ]);
    const track3 = new QuaternionKeyFrameTrack("Whole Body.Body.Right Leg Joint", [
      QuaternionKeyFrame.fromEuler(0, 0, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(2, 0, 0, -10, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(4, 0, 0, -20, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(6, 0, 0, -30, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(8, 0, 0, -40, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(10, 0, 0, -50, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(12, 0, 0, -60, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(14, 0, 0, -50, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(16, 0, 0, -40, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(18, 0, 0, -30, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(20, 0, 0, -20, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(22, 0, 0, -10, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(24, 0, 0, 0, EasingType.inOutSine),
    ]);
    const track6 = new TranslationKeyFrameTrack("Whole Body", [
      new Vec3KeyFrame(0, new Vector3(0, 0, 0), EasingType.linear),
      new Vec3KeyFrame(6, new Vector3(0, 1, 0), EasingType.inOutSine),
      new Vec3KeyFrame(12, new Vector3(0, 0, 0), EasingType.linear),
      new Vec3KeyFrame(18, new Vector3(0, 1, 0), EasingType.inOutSine),
      new Vec3KeyFrame(24, new Vector3(0, 0, 0), EasingType.linear),
    ]);
    animationClip.addTrack(track);
    animationClip.addTrack(track1);
    animationClip.addTrack(track2);
    animationClip.addTrack(track3);
    animationClip.addTrack(track6);
    const animationRunner = new AnimationRunner(animationClip, createScene, { fps: 7 });
    animationRunner.isPlaying = true;
    animationRunner.isReverse = false;
    setAnimationRunner(animationRunner);
    setRootNode(mainScene)
  };

  const DinosaursModel = () => {
    const mainScene = new Node(
      0,
      'Scene Dinosaurs Model',
      new Vector3(0, 0, 0),
      new Vector3(0, 0, 0),
      new Vector3(1, 1, 1),
    );
    const createScene = new Scene(mainScene);

    const newCamera = new Camera(
      1,
      'Main Camera',
      5,
      0,
      new Point(0, -2, 0),
      CameraType.Orthographic,
    );
    newCamera.setParent(mainScene);

    setCamera(newCamera);
    setScene(createScene);

    // Main structure
    const emptyMaterial = new BasicMaterial({ color: Color.fromHex(0x00fff0) });
    const mainBody = new Mesh(
      2,
      'Whole Body',
      new BoxGeometry(0, 0, 0),
      emptyMaterial,
    );
    const bodyMaterial = new BasicMaterial({ color: Color.fromHex(0x90EE90) });
    const body = new Mesh(
      3,
      'Body',
      new BoxGeometry(0.8, 0.6, 1.6),
      bodyMaterial,
    );
    const neckMaterial = new BasicMaterial({ color: Color.fromHex(0x32CD32) });
    const neck = new Mesh(
      4,
      'Neck',
      new BoxGeometry(0.4, 1, 0.4),
      neckMaterial,
      new Vector3(0, 0.6, 0.6),
    );
    const headMaterial = new BasicMaterial({ color: Color.fromHex(0x006400) });
    const head = new Mesh(
      5,
      'Head',
      new BoxGeometry(0.4, 0.4, 0.5),
      headMaterial,
      new Vector3(0, 0.6, 0.0),
    );
    const mouthMaterial = new BasicMaterial({ color: Color.fromHex(0xFF4500) });
    const mouth = new Mesh(
      6,
      'Mouth',
      new BoxGeometry(0.4, 0.2, 0.3),
      mouthMaterial,
      new Vector3(0, -0.1, 0.3),
    );
    //Left Joint Front Leg
    const leftfrontLegJoint = new Mesh(
      7,
      'Left Front Leg Joint',
      new BoxGeometry(0, 0, 0),
      emptyMaterial,
      new Vector3(-0.3, -0.2, 0.6),
    );
    //Left Front Leg
    const leftfrontLegMaterial = new BasicMaterial({
      color: Color.fromHex(0x8B4513),
    });
    const leftfrontLeg = new Mesh(
      7,
      'Left Front Leg',
      new BoxGeometry(0.2, 0.6, 0.3),
      leftfrontLegMaterial,
      new Vector3(0, -0.3, 0),
      new Vector3(180, 0, 0),
    );
    //Right Front Leg Joint
    const rightfrontLegJoint = new Mesh(
      8,
      'Right Front Leg Joint',
      new BoxGeometry(0, 0, 0),
      emptyMaterial,
      new Vector3(0.3, -0.2, 0.6),
    );
    //Right Front Leg
    const rightfrontLegMaterial = new BasicMaterial({
      color: Color.fromHex(0x8B4513),
    });
    const rightfrontLeg = new Mesh(
      8,
      'Right Front Leg',
      new BoxGeometry(0.2, 0.6, 0.3),
      rightfrontLegMaterial,
      new Vector3(0, -0.3, 0),
      new Vector3(180, 0, 0),
    );
    //Left Back Leg Joint
    const leftbackLegJoint = new Mesh(
      9,
      'Left Back Leg Joint',
      new BoxGeometry(0, 0, 0),
      emptyMaterial,
      new Vector3(-0.3, -0.2, -0.6),
    );
    //Left Back Leg
    const leftbackLegMaterial = new BasicMaterial({
      color: Color.fromHex(0x8B4513),
    });
    const leftbackLeg = new Mesh(
      9,
      'Left Back Leg',
      new BoxGeometry(0.2, 0.6, 0.3),
      leftbackLegMaterial,
      new Vector3(0, -0.3, 0),
      new Vector3(180, 0, 0),
    );
    //Right Back Leg Joint
    const rightbackLegJoint = new Mesh(
      10,
      'Right Back Leg Joint',
      new BoxGeometry(0, 0, 0),
      emptyMaterial,
      new Vector3(0.3, -0.2, -0.6),
    );
    //Right Back Leg
    const rightbackLegMaterial = new BasicMaterial({
      color: Color.fromHex(0x8B4513),
    });
    const rightbackLeg = new Mesh(
      10,
      'Right Back Leg',
      new BoxGeometry(0.2, 0.6, 0.3),
      rightbackLegMaterial,
      new Vector3(0, -0.3, 0),
      new Vector3(180, 0, 0),
    );
    //Tail Joint
    const tailJoint = new Mesh(
      13,
      'Tail Joint',
      new BoxGeometry(0, 0, 0),
      emptyMaterial,
      new Vector3(0, 0, -0.55),
    );
    //Tail
    const tailMaterial = new BasicMaterial({ color: Color.fromHex(0xD2B48C) });
    const tail = new Mesh(
      11,
      'Tail',
      new BoxGeometry(0.2, 0.3, 0.7),
      tailMaterial,
      new Vector3(0, 0, -0.55),
    );
    mainBody.setParent(mainScene);
    body.setParent(mainBody);
    neck.setParent(body);
    head.setParent(neck);
    mouth.setParent(head);
    leftfrontLegJoint.setParent(body);
    leftfrontLeg.setParent(leftfrontLegJoint);
    rightfrontLegJoint.setParent(body);
    rightfrontLeg.setParent(rightfrontLegJoint);
    leftbackLegJoint.setParent(body);
    leftbackLeg.setParent(leftbackLegJoint);
    rightbackLegJoint.setParent(body);
    rightbackLeg.setParent(rightbackLegJoint);
    tailJoint.setParent(body);
    tail.setParent(tailJoint);

    const lights = new DirectionalLight(
      13,
      'Directional Light',
      new Vector3(0, 0, 0),
      new Vector3(0, 0, 0),
      new Vector3(1, 1, 1),
      new Mat4(),
      new Mat4(),
      null,
      new Color(1, 1, 1, 1),
      0.1,
      new Vector3(1, 1, 1)
    )
    lights.setParent(mainScene);
    setLight(lights);
    const animationClip = new AnimationClip("Animasi Dinosaurs", 12);
    const track = new QuaternionKeyFrameTrack("Whole Body.Body.Right Front Leg Joint", [
      QuaternionKeyFrame.fromEuler(0, -20, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(2, 20, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(4, -20, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(6, 20, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(8, -20, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(10, 20, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(12, -20, 0, 0, EasingType.inOutSine),
    ]);

    const track2 = new QuaternionKeyFrameTrack("Whole Body.Body.Left Front Leg Joint", [
      QuaternionKeyFrame.fromEuler(0, -20, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(2, 20, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(4, -20, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(6, 20, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(8, -20, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(10, 20, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(12, -20, 0, 0, EasingType.inOutSine),
    ]);

    const track3 = new QuaternionKeyFrameTrack("Whole Body.Body.Right Back Leg Joint", [
      QuaternionKeyFrame.fromEuler(0, 20, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(2, -20, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(4, 20, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(6, -20, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(8, 20, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(10, -20, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(12, 20, 0, 0, EasingType.inOutSine),
    ]);

    const track4 = new QuaternionKeyFrameTrack("Whole Body.Body.Left Back Leg Joint", [
      QuaternionKeyFrame.fromEuler(0, 20, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(2, -20, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(4, 20, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(6, -20, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(8, 20, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(10, -20, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(12, 20, 0, 0, EasingType.inOutSine),
    ]);

    const track5 = new QuaternionKeyFrameTrack("Whole Body.Body.Tail Joint", [
      QuaternionKeyFrame.fromEuler(0, 0, -20, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(2, 0, 20, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(4, 0, -20, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(6, 0, 20, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(8, 0, -20, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(10, 0, 20, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(12, 0, -20, 0, EasingType.inOutSine),
    ]);

    const track6 = new TranslationKeyFrameTrack("Whole Body", [
      new Vec3KeyFrame(0, new Vector3(0, 0, -10), EasingType.linear),
      new Vec3KeyFrame(12, new Vector3(0, 0, 5), EasingType.outElastic),
    ]);

    animationClip.addTrack(track);
    animationClip.addTrack(track2);
    animationClip.addTrack(track3);
    animationClip.addTrack(track4);
    animationClip.addTrack(track5);
    animationClip.addTrack(track6);
    const animationRunner = new AnimationRunner(animationClip, createScene, { fps: 5 });
    animationRunner.isPlaying = true;
    animationRunner.isReverse = false;

    setAnimationRunner(animationRunner);
    setRootNode(mainScene)
  };

  const ChickenModel = () => {
    const mainScene = new Node(
      0,
      'Scene CHicken Model',
      new Vector3(0, 0, 0),
      new Vector3(0, 0, 0),
      new Vector3(1, 1, 1),
    );
    const createScene = new Scene(mainScene);

    const newCamera = new Camera(
      1,
      'Main Camera',
      5,
      0,
      new Point(0, 0, 0),
      CameraType.Perspective,
    );
    newCamera.setParent(mainScene);

    setCamera(newCamera);
    setScene(createScene);
    // Main structure
    const emptyMaterial = new BasicMaterial({ color: Color.fromHex(0x00fff0) });
    const mainBody = new Mesh(
      2,
      'Whole Body',
      new BoxGeometry(0, 0, 0),
      emptyMaterial,
      undefined,
      undefined,
      new Vector3(0.3, 0.3, 0.3),
    );
    mainBody.setParent(mainScene);

    // The body
    const physicalBodyMaterial = new BasicMaterial({
      color: Color.fromHex(0xFFFFFF),
    });
    const physicalBody = new Mesh(
      5,
      'Body',
      new BoxGeometry(4, 3, 5),
      physicalBodyMaterial,
    );
    physicalBody.setParent(mainBody);

    // The head
    const physicalHeadMaterial = new BasicMaterial({
      color: Color.fromHex(0xFFFFFF),
    });
    const physicalHead = new Mesh(
      3,
      'Head',
      new BoxGeometry(3, 3, 2),
      physicalHeadMaterial,
      new Vector3(0, 2.5, 2.5),
    );
    physicalHead.setParent(physicalBody);

    // The beak
    const physicalBeakMaterial = new BasicMaterial({
      color: Color.fromHex(0xFFD700),
    });
    const physicalBeak = new Mesh(
      4,
      'Beak',
      new BoxGeometry(3, 1.5, 1.6),
      physicalBeakMaterial,
      new Vector3(0, 0, 1.8),
    );
    physicalBeak.setParent(physicalHead);

    const LWingJoint = new Mesh(
      7,
      'Left Wing Joint',
      new BoxGeometry(0, 0, 0),
      emptyMaterial,
      new Vector3(2.4, 0.7, 0),
    );
    LWingJoint.setParent(physicalBody);

    // The Left Wing
    const physicalLWingMaterial = new BasicMaterial({
      color: Color.fromHex(0xD3D3D3),
    });
    const physicalLWing = new Mesh(
      6,
      'Left Wing',
      new BoxGeometry(0.8, 2.5, 3),
      physicalLWingMaterial,
      new Vector3(0, -0.7, 0),
    );
    physicalLWing.setParent(LWingJoint);

    const RWingJoint = new Mesh(
      7,
      'Right Wing Joint',
      new BoxGeometry(0, 0, 0),
      emptyMaterial,
      new Vector3(-2.4, 0.7, 0),
    );
    RWingJoint.setParent(physicalBody);

    // The Right Wing
    const physicalRWingMaterial = new BasicMaterial({
      color: Color.fromHex(0xD3D3D3),
    });
    const physicalRWing = new Mesh(
      7,
      'Right Wing',
      new BoxGeometry(0.8, 2.5, 3),
      physicalRWingMaterial,
      new Vector3(0, -0.7, 0),
    );
    physicalRWing.setParent(RWingJoint);

    // Left Leg Joint
    const LLegJointgMaterial = new BasicMaterial({
      color: Color.fromHex(0x00fff0),
    });
    const LLegJoint = new Mesh(
      8,
      'Left Leg Joint',
      new BoxGeometry(0, 0, 0),
      emptyMaterial,
      new Vector3(1.5, -1.4, 0),
    );
    LLegJoint.setParent(physicalBody);

    // Left Leg
    const physicalLLegMaterial = new BasicMaterial({
      color: Color.fromHex(0xFFD700),
    });
    const physicalLLeg = new Mesh(
      8,
      'Left Leg',
      new BoxGeometry(0.4, 3, 0.4),
      physicalLLegMaterial,
      new Vector3(0, -1.5, 0),
      new Vector3(180, 0, 0),
    );
    physicalLLeg.setParent(LLegJoint);

    // Left Feet
    const physicalLFeetMaterial = new BasicMaterial({
      color: Color.fromHex(0xFFD700),
    });
    const physicalLFeet = new Mesh(
      9,
      'Left Feet',
      new BoxGeometry(1.4, 0.2, 1.6),
      physicalLFeetMaterial,
      new Vector3(0, 1.5, -0.6),
    );
    physicalLFeet.setParent(physicalLLeg);

    // Right Leg Joint
    const RLegJointMaterial = new BasicMaterial({
      color: Color.fromHex(0x00fff0),
    });

    const RLegJoint = new Mesh(
      10,
      'Right Leg Joint',
      new BoxGeometry(0, 0, 0),
      emptyMaterial,
      new Vector3(-1.5, -1.4, 0),
    );
    RLegJoint.setParent(physicalBody);

    // Right Leg
    const physicalRLegMaterial = new BasicMaterial({
      color: Color.fromHex(0xFFD700),
    });

    const physicalRLeg = new Mesh(
      10,
      'Right Leg',
      new BoxGeometry(0.4, 3, 0.4),
      physicalRLegMaterial,
      new Vector3(0, -1.5, 0),
      new Vector3(180, 0, 0),
    );
    physicalRLeg.setParent(RLegJoint);

    // Right Feet
    const physicalRFeetMaterial = new BasicMaterial({
      color: Color.fromHex(0xFFD700),
    });
    const physicalRFeet = new Mesh(
      11,
      'Right Feet',
      new BoxGeometry(1.4, 0.2, 1.6),
      physicalRFeetMaterial,
      new Vector3(0, 1.5, -0.6),
    );
    physicalRFeet.setParent(physicalRLeg);

    const lights = new DirectionalLight(
      13,
      'Directional Light',
      new Vector3(0, 0, 0),
      new Vector3(0, 0, 0),
      new Vector3(1, 1, 1),
      new Mat4(),
      new Mat4(),
      null,
      new Color(1, 1, 1, 1),
      0.1,
      new Vector3(1, 1, 1)
    )
    lights.setParent(mainScene);
    setLight(lights);
    const animationClip = new AnimationClip("Animasi Chicken", 12);
    const track = new QuaternionKeyFrameTrack("Whole Body.Body.Right Leg Joint", [
      QuaternionKeyFrame.fromEuler(0, 20, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(2, -20, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(4, 20, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(6, -20, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(8, 20, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(10, -20, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(12, 20, 0, 0, EasingType.inOutSine),
    ]);

    const track2 = new QuaternionKeyFrameTrack("Whole Body.Body.Left Leg Joint", [
      QuaternionKeyFrame.fromEuler(0, -20, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(2, 20, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(4, -20, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(6, 20, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(8, -20, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(10, 20, 0, 0, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(12, -20, 0, 0, EasingType.inOutSine),
    ]);

    const track3 = new QuaternionKeyFrameTrack("Whole Body.Body.Left Wing Joint", [
      QuaternionKeyFrame.fromEuler(0, 0, 0, -15, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(1, 0, 0, -90, EasingType.outExpo),
      QuaternionKeyFrame.fromEuler(2, 0, 0, -15, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(3, 0, 0, -90, EasingType.outExpo),
      QuaternionKeyFrame.fromEuler(4, 0, 0, -15, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(5, 0, 0, -90, EasingType.outExpo),
      QuaternionKeyFrame.fromEuler(6, 0, 0, -15, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(7, 0, 0, -90, EasingType.outExpo),
      QuaternionKeyFrame.fromEuler(8, 0, 0, -15, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(9, 0, 0, -90, EasingType.outExpo),
      QuaternionKeyFrame.fromEuler(10, 0, 0, -15, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(11, 0, 0, -90, EasingType.outExpo),
      QuaternionKeyFrame.fromEuler(12, 0, 0, -15, EasingType.inOutSine),
    ]);

    const track4 = new QuaternionKeyFrameTrack("Whole Body.Body.Right Wing Joint", [
      QuaternionKeyFrame.fromEuler(0, 0, 0, 15, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(1, 0, 0, 90, EasingType.outExpo),
      QuaternionKeyFrame.fromEuler(2, 0, 0, 15, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(3, 0, 0, 90, EasingType.outExpo),
      QuaternionKeyFrame.fromEuler(4, 0, 0, 15, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(5, 0, 0, 90, EasingType.outExpo),
      QuaternionKeyFrame.fromEuler(6, 0, 0, 15, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(7, 0, 0, 90, EasingType.outExpo),
      QuaternionKeyFrame.fromEuler(8, 0, 0, 15, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(9, 0, 0, 90, EasingType.outExpo),
      QuaternionKeyFrame.fromEuler(10, 0, 0, 15, EasingType.inOutSine),
      QuaternionKeyFrame.fromEuler(11, 0, 0, 90, EasingType.outExpo),
      QuaternionKeyFrame.fromEuler(12, 0, 0, 15, EasingType.inOutSine),
    ]);

    const track5 = new TranslationKeyFrameTrack("Whole Body", [
      new Vec3KeyFrame(0, new Vector3(0, 0, -15), EasingType.linear),
      new Vec3KeyFrame(12, new Vector3(0, 0, 8), EasingType.outElastic),
    ]);

    animationClip.addTrack(track);
    animationClip.addTrack(track2);
    animationClip.addTrack(track3);
    animationClip.addTrack(track4);
    animationClip.addTrack(track5);
    const animationRunner = new AnimationRunner(animationClip, createScene, { fps: 10 });
    animationRunner.isPlaying = true;
    animationRunner.isReverse = false;

    setAnimationRunner(animationRunner);
    setRootNode(mainScene);
    
  };

  const BoxTiga = () => {
    const mainScene = new Node(
      0,
      'Scene Box',
      new Vector3(0, 0, 0),
      new Vector3(0, 0, 0),
      new Vector3(1, 1, 1),
    );
    const createScene = new Scene(mainScene);

    const newCamera = new Camera(
      1,
      'Main Camera',
      5,
      0,
      new Point(0, 0, -5),
      CameraType.Perspective,
    );
    newCamera.setParent(mainScene);

    const ambientColor = Color.fromHex(0x202020);
    const diffuseColor = Color.fromHex(0xbcdf00);
    const specularColor = Color.fromHex(0xffffff);
    const shininess = 0.1;

    const ambientColor2 = Color.fromHex(0x505050);
    const diffuseColor2 = Color.fromHex(0xbcdf00);
    const specularColor2 = Color.fromHex(0xffffff);
    const shininess2 = 0.2;

    const ambientColor3 = Color.fromHex(0x808080);
    const diffuseColor3 = Color.fromHex(0xbcdf00);
    const specularColor3 = Color.fromHex(0xffffff);
    const shininess3 = 1;

    
    const texture = new Texture();
    const image = new Image();
    image.src = '/images/Mercury/Mercury.jpg';
    image.onload = () => {
      texture.setData(image);
    }; 

    const normalTexture = new Texture();
    const newImage = new Image();
    newImage.src = '/images/Mercury/MercuryNormal.png';
    newImage.onload = () => {
      normalTexture.setData(image);
    }; 

    const normalDisplacementTexture = new Texture();
    const newImage2 = new Image();
    newImage2.src = '/images/Mercury/MercuryDisplacement.png';
    newImage2.onload = () => {
      normalDisplacementTexture.setData(image);
    }; 

    const normalTexture2 = new Texture();
    normalTexture2.setData(generateBrickNormalMap(), 64, 64);

    const normalTexture3 = new Texture();
    normalTexture3.setData(generateBrickNormalMap(), 64, 64);

    const noiseNormalTexture = new Texture();
    noiseNormalTexture.setData(generateRippleDisplacement(), 64, 64);
    const noiseNormalTexture2 = new Texture();
    noiseNormalTexture2.setData(generateRippleDisplacement(), 64, 64);
    const noiseNormalTexture3 = new Texture();
    noiseNormalTexture3.setData(generateRippleDisplacement(), 64, 64);
    
    // phongMaterial.normalMap = normalTexture;
    // phongMaterial.displacementMap = noiseNormalTexture;

    // phongMaterial2.normalMap = normalTexture2;
    // phongMaterial2.displacementMap = noiseNormalTexture2;

    // phongMaterial3.normalMap = normalTexture3;
    // phongMaterial3.displacementMap = noiseNormalTexture3;

    const phongMaterial = new PhongMaterial({
      ambientColor: ambientColor,
      diffuseColor: diffuseColor,
      specularColor: specularColor,
      shininess: shininess,
      diffuseMap: texture,
      normalMap: normalTexture,
      displacementMap: normalDisplacementTexture
    })

    // const phongMaterial2 = new PhongMaterial({
    //   ambientColor: ambientColor2,
    //   diffuseColor: diffuseColor2,
    //   specularColor: specularColor2,
    //   shininess: shininess2,
    //   normalMap: normalTexture2,
    //   displacementMap: noiseNormalTexture2,
    // })

    // const phongMaterial3 = new PhongMaterial({
    //   ambientColor: ambientColor3,
    //   diffuseColor: diffuseColor3,
    //   specularColor: specularColor3,
    //   shininess: shininess3,
    //   normalMap: normalTexture3,
    //   displacementMap: noiseNormalTexture3,
    // })
    const boxMaterial = new BasicMaterial({
      color: Color.fromHex(0x00fff0),
    });

    const mainBody = new Mesh(
      2,
      'Box 1',
      new SphereGeometry(2, 128, 76),
      boxMaterial
    );

    // const lights = new DirectionalLight(
    //   3,
    //   'Directional Light',
    //   new Vector3(0, 0, 0),
    //   new Vector3(0, 0, 0),
    //   new Vector3(1, 1, 1),
    //   new Mat4(),
    //   new Mat4(),
    //   null,
    //   new Color(1, 1, 1, 1),
    //   0.1,
    //   new Vector3(1, 1, 1)
    // )

    const lights = new PointLight(
      3,
      'Point Light',
      new Vector3(0, 0, 0),
      new Vector3(0, 0, 0),
      new Vector3(1, 1, 1),
      new Mat4(),
      new Mat4(),
      null,
      new Color(1, 1, 1, 1),
      0.1,
      0.5
    )

    lights.setParent(mainScene);
    // dirlights.setParent(mainScene);

    // const box2 = new Mesh(
    //   3,
    //   'Box 2',
    //   new BoxGeometry(1, 1, 1),
    //   phongMaterial2
    // )

    // const box3 = new Mesh(
    //   4,
    //   'Box 3',
    //   new BoxGeometry(1, 1, 1),
    //   phongMaterial3
    // )
    mainBody.setParent(mainScene);
    // box2.setParent(mainScene);
    // box3.setParent(mainScene);
    setCamera(newCamera);
    setLight(lights);
    setScene(createScene);
    setRootNode(mainScene);
  }

  const Box = () => {
    const mainScene = new Node(
      0,
      'Scene Box',
      new Vector3(0, 0, 0),
      new Vector3(0, 0, 0),
      new Vector3(1, 1, 1),
    );
    const createScene = new Scene(mainScene);

    const newCamera = new Camera(
      1,
      'Main Camera',
      5,
      0,
      new Point(0, 0, -5),
      CameraType.Perspective,
    );
    newCamera.setParent(mainScene);

    const boxMaterial = new BasicMaterial({
      color: Color.fromHex(0x00fff0),
    });

    const mainBody = new Mesh(
      2,
      'Box 1',
      new PlaneGeometry(10, 10, 100, 100),
      boxMaterial,
    );

    const lights = new DirectionalLight(
      3,
      'Directional Light',
      new Vector3(0, 0, 0),
      new Vector3(0, 0, 0),
      new Vector3(1, 1, 1),
      new Mat4(),
      new Mat4(),
      null,
      new Color(1, 1, 1, 1),
      0.1,
      new Vector3(1, 1, 1)
    )

    lights.setParent(mainScene);
    // dirlights.setParent(mainScene);

    
    mainBody.setParent(mainScene);
    setCamera(newCamera);
    setLight(lights);
    setScene(createScene);
    setRootNode(mainScene);
  }


  const Hollow = () => {
    const mainScene = new Node(
      0,
      'Hollow Scene',
      new Vector3(0, 0, 0),
      new Vector3(0, 0, 0),
      new Vector3(1, 1, 1),
    );
    const createScene = new Scene(mainScene);

    const newCamera = new Camera(
      1,
      'Main Camera',
      5,
      0,
      new Point(0, 0, -5),
      CameraType.Orthographic,
    );
    newCamera.setParent(mainScene);


    // Box
    const boxMaterial = new BasicMaterial({
      color: Color.fromHex(0x00fff0),
    });
    const box = new Mesh(
      2,
      'Hollow Tesseract',
      new HollowBoxGeometry(),
      boxMaterial,
    );
    box.setParent(mainScene);

    // Light

    const lighting = new AmbientLight(
      3, // id
      'Ambient Light', // name
      new Vector3(0, 0, 0), // Translation
      new Vector3(0, 0, 0), // rotation
      new Vector3(1, 1, 1), // scale
      new Mat4(), // localMatrix
      new Mat4(), // worldMatrix
      null, // parent
      new Color(1, 1, 0, 1),
      1
    )

    lighting.setParent(mainScene);
    setLight(lighting);
    setCamera(newCamera);
    setScene(createScene);
    setRootNode(mainScene); 
  }
  useEffect(() => {
    if (!initializedRef.current) {
      // DinosaursModel();

      // initializeScene();
      // ChickenModel();
      // Box();
      // BoxTiga();
      Hollow();
      initializedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { scene, camera, light, animationRunner, setScene, setCamera, setLight, setAnimationRunner, initializeScene };
};
