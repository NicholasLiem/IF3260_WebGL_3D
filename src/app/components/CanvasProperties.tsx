import { TextField, Typography } from '@mui/material';
import { useState } from 'react';

interface CanvasPropertiesProps {
  setBackgroundColor: (color: number[]) => void;
}

export default function CanvasProperties({
  setBackgroundColor,
}: CanvasPropertiesProps) {
  const [backgroundColor, setInternalBackgroundColor] = useState<number[]>([
    0.2, 0.2, 0.2, 1.0,
  ]);
  
  const handleBackgroundColorChange = (index: number, value: string) => {
    const newColor = [...backgroundColor];
    newColor[index] = parseFloat(value);
    setInternalBackgroundColor(newColor);
    setBackgroundColor(newColor);
  };

  return (
    <div className="px-3">
      <div className="flex flex-col mb-4">
        <Typography variant="h6">Canvas Background Color</Typography>
        <div className="flex flex-row mb-2">
          {['R', 'G', 'B', 'A'].map((channel, index) => (
            <TextField
              key={channel}
              label={channel}
              type="number"
              value={backgroundColor[index]}
              onChange={(e) =>
                handleBackgroundColorChange(index, e.target.value)
              }
              size="small"
              variant="outlined"
              margin="dense"
              style={{ marginRight: 8, width: 80 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
