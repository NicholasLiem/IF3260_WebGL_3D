import { Drawer, ShaderType } from '@/webgl/Drawer';
import { memo, useEffect, useRef } from 'react';
import Node from '@/webgl/Impl/Engine/Node';
import Scene from '@/webgl/Impl/Scene/Scene';
import Mesh from '@/webgl/Impl/Mesh/Mesh';
import Camera from '@/webgl/Impl/Engine/Camera';
import AnimationRunner from "@/webgl/Impl/Animation/AnimationRunner";
import OrbitControls from '@/webgl/Impl/Engine/OrbitControl';
import { PhongMaterial } from '@/webgl/Impl/Material/PhongMaterial';
import Light from '@/webgl/Impl/Light/Light';
import { BasicMaterial } from '@/webgl/Impl/Material/BasicMaterial';
import DirectionalLight from '@/webgl/Impl/Light/DirectionalLight';
import { ShaderMaterial } from '@/webgl/Impl/Material/ShaderMaterial';
import Vector3 from '@/webgl/Impl/Type/Math/Vector3';
import PointLight from '@/webgl/Impl/Light/PointLight';

interface CanvasProps {
  scene: Scene | null;
  camera: Camera | null;
  light: Light | null;
  animationRunner: AnimationRunner | null;
  backgroundColor: number[];
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentFrame: (frame: number) => void;
}

const Canvas = ({
  scene,
  camera,
  light,
  animationRunner,
  backgroundColor,
  setIsPlaying,
  setCurrentFrame,
}: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawerRef = useRef<Drawer>();
  const lastFrameTime = useRef<number | null>(null);
  const animationRunnerRef = useRef<AnimationRunner | null>(null);
  const orbitControlsRef = useRef<OrbitControls | null>(null);
    
  useEffect(() => {
    animationRunnerRef.current = animationRunner;
  }, [animationRunner]);

  useEffect(() => {
    if (!scene || !camera || !light) {
      return;
    }

    if (canvasRef.current) {
      const gl = canvasRef.current.getContext('webgl', { antialias: true });
      const dpr = window.devicePixelRatio || 1;
      const rect = canvasRef.current.getBoundingClientRect();

      if (!gl || !rect) {
        console.error('Unable to initialize WebGL.');
        return;
      }

      canvasRef.current.width = rect.width * dpr || 1;
      canvasRef.current.height = rect.height * dpr || 1;
      gl.viewport(0, 0, canvasRef.current.width, canvasRef.current.height);

      drawerRef.current = new Drawer(gl);
      camera.setCanvas(canvasRef.current.width, canvasRef.current.height);
      drawerRef.current.resizeCanvasToDisplaySize(canvasRef.current);

      orbitControlsRef.current = new OrbitControls(camera, canvasRef.current);
      requestAnimationFrame(runAnimation);

      return () => {
        orbitControlsRef.current?.dispose();
        if (drawerRef.current) {
          drawerRef.current.getGL().deleteProgram(drawerRef.current.getProgram());
          drawerRef.current = undefined;
        }
      };
    }
  }, [scene, camera, light]);

  useEffect(() => {
    if (drawerRef.current) {
      requestAnimationFrame(runAnimation);
    }
  }, [camera, light, backgroundColor]);
  
  function draw(node: Node, viewProjectionMatrix: Float32Array) {
    if (!drawerRef.current) return;

    const drawerInstance = drawerRef.current;

    if (node instanceof Mesh) {
      const vertices                = node.geometry.getAttribute('position').data as Float32Array;
      const normals                 = node.geometry.getAttribute('normal').data as Float32Array;
      const tangents                = node.geometry.getAttribute('tangent').data as Float32Array || new Float32Array([]);
      const texCoords               = node.geometry.getAttribute('texCoord').data as Float32Array;
      const vertexColor             = node.geometry.getAttribute('color').data as Float32Array;
      const indices                 = node.geometry.indices?.data as Uint16Array;
      const diffuseMap              = node.material instanceof PhongMaterial ? node.material.diffuseMap : undefined;
      const specularMap             = node.material instanceof PhongMaterial ? node.material.specularMap : undefined;
      const normalMapTexture        = node.material instanceof PhongMaterial ? node.material.normalMap : undefined;
      const displacementMapTexture  = node.material instanceof PhongMaterial ? node.material.displacementMap : undefined;

      const material = node.material as ShaderMaterial;
      let materialColor: Float32Array = new Float32Array([0, 0, 0, 1]);
      let diffuseColor: Float32Array  = new Float32Array([1, 1, 1, 1]);
      let specularColor: Float32Array = new Float32Array([1, 1, 1, 1]);
      let shininess: number = 10;
      let ambientCoef: number = 0.9;
      let specularCoef: number = 0.9;
      let displacementCoef: number = 0.1;

      if (material instanceof BasicMaterial) {
        materialColor = new Float32Array(material.color.toArray());
      } else if (material instanceof PhongMaterial) {
        materialColor = new Float32Array(material.ambientColor.toArray());
        diffuseColor = new Float32Array(material.diffuseColor.toArray());
        specularColor = new Float32Array(material.specularColor.toArray());
        shininess = material.shininess;
        ambientCoef = material.ambientCoef || ambientCoef;
        specularCoef = material.specularCoef || specularCoef;
        displacementCoef = material.displacementCoef || displacementCoef;
      }

      const buffers = drawerInstance.setBuffers(vertices, normals, vertexColor, indices, texCoords, tangents);
      const worldMatrix = node.worldMatrix;
      const modelViewMatrix = camera!.getModelViewMatrix(worldMatrix.elements);
      const normalMatrix = camera!.getNormalMatrix(modelViewMatrix);

      const lightPosVector = light?.translation || new Vector3(1, 1, 1);
      const lightPosition = new Float32Array([lightPosVector.x, lightPosVector.y, lightPosVector.z]);
      const lightColor = light ? new Float32Array(light.color.toArray()) : new Float32Array([0, 0, 0, 1]);
      const lightDirection = light instanceof DirectionalLight ? new Float32Array([light.direction.x, light.direction.y, light.direction.z]) : new Float32Array([0, 0, 0]);
      const lightRadius = light instanceof PointLight ? light.radius : 0;

      const useVertexColor = node.useVertexColor;

      drawerInstance.updateShaders(material.vertexShader, material.fragmentShader);
      drawerInstance.draw({
        buffers,
        viewProjectionMatrix,
        worldMatrix: worldMatrix.elements,
        normalMatrix: normalMatrix,
        indexCount: indices.length,
        materialColor: materialColor,
        light: {
          lightPosition: lightPosition,
          lightDirection: lightDirection,
          lightColor: lightColor,
          lightRadius: lightRadius,
        },
        textures: {
          diffuse: diffuseMap,
          specular: specularMap,
          normal: normalMapTexture,
          displacement: displacementMapTexture,
          ambientCoef: ambientCoef,
          specularCoef: specularCoef,
          displacementCoef: displacementCoef,
        },
        phongProperties: {
          diffuseColor: diffuseColor,
          specularColor: specularColor,
          shininess: shininess
        },
        useVertexColor: useVertexColor
      });
    }

    for (const child of node.children) {
      draw(child, viewProjectionMatrix);
    }
  }

  function render() {
    if (!camera || !scene || !light) return;

    const viewProjectionMatrix = camera.getViewProjectionMatrix();
    draw(scene.getRoot(), viewProjectionMatrix);
  }

  function runAnimation(currentTime: number) {
    if (!drawerRef.current) return;

    const gl = drawerRef.current.getGL();
    const [r, g, b, a] = backgroundColor;
    gl.clearColor(r, g, b, a);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    drawerRef.current.prepareToDraw();

    if (!lastFrameTime.current) {
      lastFrameTime.current = currentTime;
    }

    const deltaSecond = (currentTime - lastFrameTime.current) / 1000;
    lastFrameTime.current = currentTime;

    if (animationRunnerRef.current && animationRunnerRef.current.isPlaying) {
      animationRunnerRef.current.update(deltaSecond);
      setCurrentFrame(animationRunnerRef.current.CurrentFrame);
      setIsPlaying(animationRunnerRef.current.isPlaying);
    }

    render();
    requestAnimationFrame(runAnimation);
  }

  return (
    <div className="w-fit h-fit overflow-auto">
      <canvas
        ref={canvasRef}
        id="webgl-canvas"
        className="w-[740px] h-[370px]"
      />
    </div>
  );
};

export default memo(Canvas);
