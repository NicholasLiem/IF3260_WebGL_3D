import { AnimationClip } from "@/webgl/Impl/Animation/AnimationClip";
import AnimationRunner from "@/webgl/Impl/Animation/AnimationRunner";
import Scene from "@/webgl/Impl/Scene/Scene";
import { toast } from "react-hot-toast";
import Node from "@/webgl/Impl/Engine/Node";
import Camera from "@/webgl/Impl/Engine/Camera";
import Light from "@/webgl/Impl/Light/Light";

const downloadJSON = (json: string, filename: string) => {
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const saveScene = (scene: Scene | null) => {
  if (!scene) return;
  const sceneJSON = JSON.stringify(scene.to_json(), null, 2);
  downloadJSON(sceneJSON, "scene.json");
};

export const saveAnimation = (animation: AnimationClip | null) => {
  if (!animation) return;
  const animationJSON = JSON.stringify(animation.to_json(), null, 2);
  downloadJSON(animationJSON, "animation.json");
};

export const loadScene = async (
  file: File | null,
  animationRunner: AnimationRunner | null,
  setScene: (scene: Scene) => void,
  setCamera: (camera: Camera) => void,
  setRootNode: (node: Node) => void,
  setLight: (light: Light) => void,
  setSelectedNode: () => void
) => {
  if (!file) return;

  try {
    const text = await file.text();
    const json = JSON.parse(text);
    const newScene = await Scene.from_json(json);

    if (animationRunner) {
      animationRunner.Scene = newScene;
    }

    const newCamera = newScene.getCamera();
    const newLight = newScene.getLight();

    if (!newCamera || !newLight) {
      toast.error("No camera or light found in this scene");
      return;
    }

    const rootNode = newScene.getRoot();
    setCamera(newCamera);
    setSelectedNode();
    setScene(newScene);
    setRootNode(rootNode);
    setLight(newLight);

    toast.success("Scene loaded successfully");
  } catch (error) {
    toast.error("Error loading scene");
  }
};

export const loadAnimation = async (
  file: File | null,
  scene: Scene,
  animationRunner: AnimationRunner,
  setAnimationRunner: (runner: AnimationRunner) => void
) => {
  if (!file) return;

  try {
    const text = await file.text();
    const json = JSON.parse(text);
    const newAnimation = AnimationClip.from_json(json);

    const newRunner = new AnimationRunner(newAnimation, scene, { fps: animationRunner.fps });
    setAnimationRunner(newRunner);

    toast.success("Animation loaded successfully");
  } catch (error) {
    toast.error("Error loading animation");
  }
};
