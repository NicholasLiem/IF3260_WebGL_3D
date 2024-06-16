import Camera from '@/webgl/Impl/Engine/Camera';
import { CameraType } from '@/webgl/Interfaces/Engine/CameraInterface';
import { MenuItem, Select, Slider } from '@mui/material';
import { useEffect, useState } from 'react';

interface CameraPropertiesProps {
  camera: Camera;
  setCamera: (camera: Camera) => void;
}

export default function CameraProperties({
  camera,
  setCamera,
}: CameraPropertiesProps) {
  const [radius, setRadius] = useState<number>(0);
  const [angle, setAngle] = useState<number>(0);
  const [perspective, setPerspective] = useState<string>(
    CameraType.Perspective,
  );

  useEffect(() => {
    if (camera) {
      setRadius(camera.radius || 0);
      setAngle(((camera.angle || 0) * 180) / Math.PI);
      setPerspective(camera.type);
    }
  }, [camera]);

  const handleAngle = (val: number) => {
    setAngle(val);
    camera.setAngle(val);
    setCamera(camera);
  };

  const handleRadius = (val: number) => {
    setRadius(val);
    camera.zoom(val);
    setCamera(camera);
  };

  const handlePerspective = (e: any) => {
    const newPerspective = e.target.value as CameraType;
    setPerspective(newPerspective);
    camera.setType(newPerspective);
    setCamera(camera);
  };

  return (
    <div className="px-3">
      <div className="flex flex-col">
        <label>Radius</label>
        <Slider
          value={radius}
          onChange={(e, val) => handleRadius(val as number)}
          min={0}
          max={100}
          step={0.1}
          valueLabelDisplay="auto"
          size="small"
        />
      </div>
      <div className="flex flex-col">
        <label>Angle</label>
        <Slider
          value={angle}
          onChange={(e, val) => handleAngle(val as number)}
          min={0}
          max={360}
          step={1}
          valueLabelDisplay="auto"
          size="small"
        />
      </div>
      <div className="flex flex-col">
        <label className="mb-3">View Type</label>
        <Select
          value={perspective}
          onChange={handlePerspective}
          size="small"
          fullWidth
        >
          <MenuItem value={CameraType.Oblique}>Oblique</MenuItem>
          <MenuItem value={CameraType.Orthographic}>Orthographic</MenuItem>
          <MenuItem value={CameraType.Perspective}>Perspective</MenuItem>
        </Select>
      </div>
    </div>
  );
}
