'use client';

import { useRef, useState } from 'react';
import Canvas from './canvas';
import { Toaster, toast } from 'react-hot-toast';
import ComponentTree from './components/ComponentTree';
import ComponentProperties from './components/ComponentProperties';
import { Button } from '@mui/material';
import CameraProperties from './components/CameraProperties';
import Camera from '@/webgl/Impl/Engine/Camera';
import { NodeProvider, useNode } from '@/app/context/NodeContext';
import CanvasProperties from './components/CanvasProperties';
import { useScene } from './hooks/useScene';
import AnimationControls from './components/AnimationControls';
import { loadScene, saveScene } from './utils/FileHandler';

export default function Home() {
  return (
    <NodeProvider>
      <MainContent />
    </NodeProvider>
  );
}

function MainContent() {
  const { selectedNode, setSelectedNode, setRootNode } = useNode();
  const { scene, camera, light, animationRunner, setScene, setCamera, setLight, setAnimationRunner, initializeScene } = useScene(setRootNode);
  const [name, setName] = useState<string>('');
  const [backgroundColor, setBackgroundColor] = useState<number[]>([0.2, 0.2, 0.2, 1.0]);
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const inputFile = useRef<HTMLInputElement | null>(null);

  const handleReset = () => {
    initializeScene();
    setSelectedNode(null);
    toast.success('Scene reset successfully');
  };

  return (
    <main className="flex w-screen h-screen min-h-screen flex-row items-center">
      <Toaster />
      <div className="flex-1 flex h-full flex-col items-center">
        <div className="w-full flex items-center justify-center flex-1 overflow-auto p-5">
          <Canvas
            scene={scene}
            camera={camera}
            light={light}
            animationRunner={animationRunner}
            backgroundColor={backgroundColor}
            setIsPlaying={setIsPlaying}
            setCurrentFrame={setCurrentFrame}
          />
        </div>
        <div className="flex flex-row w-full h-2/5 border-t-2 border-black">
          <div className="flex-1 h-full p-2">
            <h1>Animation Controls</h1>
            <AnimationControls
              scene={scene}
              animationRunner={animationRunner}
              currentFrame={currentFrame}
              isPlaying={isPlaying}
              setCurrentFrame={setCurrentFrame}
              setIsPlaying={setIsPlaying}
              setAnimationRunner={setAnimationRunner}
            />
          </div>
          <div className="flex-1 h-full p-2 border-l-2 border-black">
            <h1 className="mb-2">Camera Controls</h1>
            {camera ? (
              <CameraProperties
                key={camera.id}
                camera={camera}
                setCamera={(updatedCamera) => setCamera(updatedCamera as Camera)}
              />
            ) : (
              <p>No camera</p>
            )}
          </div>
          <div className="flex-1 p-2 border-l-2 border-black flex flex-col gap-3">
            <h1>Canvas Properties</h1>
            <CanvasProperties setBackgroundColor={setBackgroundColor} />
          </div>
          <div className="flex-1 h-full p-2 border-l-2 border-black flex flex-col gap-3">
            <h1>Settings</h1>
            <Button onClick={() => saveScene(scene)} variant="contained">
              Save
            </Button>
            <Button onClick={() => inputFile.current?.click()} variant="contained">
              Load
            </Button>
            <input
              type="file"
              id="file"
              ref={inputFile}
              style={{ display: 'none' }}
              onChange={(e) =>
                loadScene(
                  e.target.files?.[0] ?? null,
                  animationRunner,
                  setScene,
                  setCamera,
                  setRootNode,
                  setLight,
                  () => setSelectedNode(null)
                )
              }
            />
            <Button onClick={handleReset} variant="contained">
              Reset
            </Button>
          </div>
        </div>
      </div>
      <div className="flex h-full w-[25em] flex-col items-center border-l-2 border-black">
        <div className="flex-1 flex flex-col w-full p-2 overflow-auto">
          <h1 className="mb-2">Component Tree</h1>
          <div className="flex-1 overflow-auto w-full border-2">
            <ComponentTree name={name} />
          </div>
        </div>
        {selectedNode ? (
          <div className="flex-shrink-0 flex flex-col w-full h-1/2 border-t-2 border-black p-2">
            <h1>Component Properties</h1>
            <div className="flex-1 w-full box-border overflow-auto overflow-x-hidden pr-3">
              <ComponentProperties animationRunner={animationRunner} setName={setName} setCamera={setCamera} setLight={setLight} />
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
