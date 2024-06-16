import AnimationRunner from "@/webgl/Impl/Animation/AnimationRunner";
import { Button, ButtonGroup, IconButton, Slider, Stack, TextField, ToggleButton } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { FastRewind, FirstPage, LastPage, Loop, Pause, PlayArrow, Repeat, SkipNext, SkipPrevious, Stop } from "@mui/icons-material";
import Scene from "@/webgl/Impl/Scene/Scene";
import { loadAnimation, saveAnimation } from "../utils/FileHandler";

interface props {
    scene: Scene | null;
    animationRunner: AnimationRunner | null;
    currentFrame: number;
    isPlaying: boolean;
    setCurrentFrame: (frame: number) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    setAnimationRunner: (runner: AnimationRunner) => void;
}

export default function AnimationControls({ scene, animationRunner, currentFrame, isPlaying, setCurrentFrame, setAnimationRunner }: props) {
    const [inputFps, setInputFps] = React.useState<string>(animationRunner?.fps.toString() || "30");
    const [isReverse, setIsReverse] = React.useState<boolean>(animationRunner?.isReverse || false);
    const [isLoop, setIsLoop] = React.useState<boolean>(animationRunner?.isLoop || false);
    const [isFPSError, setIsFPSError] = React.useState<boolean>(false);
    const inputFile = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        setInputFps(animationRunner?.fps.toString() || "30");
        setIsReverse(animationRunner?.isReverse || false);
        setIsLoop(animationRunner?.isLoop || false);
    }, [animationRunner]);

    const mark = React.useMemo(() => {
        if (!animationRunner) return [];
        const marks = [];
        for (let i = 0; i <= animationRunner.duration; i++) {
            marks.push({ value: i, label: i.toString() });
        }
        return marks;
    }, [animationRunner]);


    function handlePlay() {
        if (!animationRunner) return;
        animationRunner.isPlaying = !animationRunner.isPlaying;
    }

    function handleStop() {
        if (!animationRunner) return;
        animationRunner.CurrentFrame = 0;
        setCurrentFrame(0);
        animationRunner.update(0);
        animationRunner.isPlaying = false
    }

    function handleFpsChange(e: React.ChangeEvent<HTMLInputElement>) {
        setInputFps(e.target.value);
    }

    function handleCommitFpsChange() {
        if (!animationRunner) return;
        if (isNaN(Number(inputFps)) || inputFps === "" || Number(inputFps) <= 0){
            setIsFPSError(true);
            return;
        }
        if (isFPSError) setIsFPSError(false);
        animationRunner.fps = Number(inputFps);
    }

    function handleFPSEnter(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            handleCommitFpsChange();
        }
    }

    function handleFrameChange(e: Event, value: number | number[]) {
        let val = value as number;
        if (val - Math.floor(val) < 0.1) {
            val = Math.floor(val);
        }
        if (Math.ceil(val) - val < 0.1) {
            val = Math.ceil(val);
        }
        if (animationRunner) {
            animationRunner.CurrentFrame = val
            setCurrentFrame(val);
            animationRunner.updateToFrame(val);
        }
    }

    function handleNextFrame() {
        if (!animationRunner) return;
        let nextFrame = Math.floor(currentFrame + 1);
        nextFrame = Math.min(nextFrame, animationRunner.duration);
        setCurrentFrame(nextFrame);
        animationRunner?.updateToFrame(nextFrame);
    }

    function handlePrevFrame() {
        if (!animationRunner) return;
        let nextFrame = Math.ceil(currentFrame - 1);
        nextFrame = Math.max(nextFrame, 0);
        setCurrentFrame(nextFrame);
        animationRunner.updateToFrame(nextFrame);
    }
    
    function handleReverse() {
        if (!animationRunner) return;
        animationRunner.isReverse = !animationRunner.isReverse;
        setIsReverse(animationRunner.isReverse);
    }

    function handleLoop() {
        if (!animationRunner) return;
        animationRunner.isLoop = !animationRunner.isLoop;
        setIsLoop(animationRunner.isLoop);
    }

    function handleToStart() {
        if (!animationRunner) return;
        setCurrentFrame(0);
        animationRunner.updateToFrame(0);
    }

    function handleToEnd() {
        if (!animationRunner) return;
        setCurrentFrame(animationRunner.duration);
        animationRunner.updateToFrame(animationRunner.duration);
    }

    function handleSave() {
        if (!animationRunner) return;
        saveAnimation(animationRunner.currentAnimation!);
    }

    function handleLoad() {
        if (!animationRunner) return;
        loadAnimation(inputFile.current?.files?.[0] ?? null, scene!, animationRunner, setAnimationRunner);
    }

    return (
        <div>
            <div className="px-3">
            <Slider 
                value={currentFrame} 
                min={0} max={animationRunner?.duration || 0} 
                onChange={handleFrameChange} 
                step={0.001}
                marks={mark}
                sx={{
                   "& .MuiSlider-thumb": {
                        transition: 'none'
                    },
                    "& .MuiSlider-track": {
                        transition: 'none'
                    },
                }}
                 />
            </div>
            <Stack direction="row" spacing={1}>
            <ButtonGroup size="small" aria-label="Small button group">
                <Button color="primary" onClick={handlePlay}>
                    {isPlaying ? <Pause /> : <PlayArrow />}
                </Button>
                <Button color="primary" onClick={handleStop}>
                    <Stop />
                </Button>
            </ButtonGroup>
            <ButtonGroup size="small" aria-label="Small button group">
                <Button color="primary" onClick={handleToStart}>
                    <FirstPage />
                </Button>
                <Button color="primary" onClick={handlePrevFrame}>
                    <SkipPrevious />
                </Button>
                <Button color="primary" onClick={handleNextFrame}>
                    <SkipNext />
                </Button>
                <Button color="primary" onClick={handleToEnd}>
                    <LastPage />
                </Button>
            </ButtonGroup>
            <ButtonGroup size="small" aria-label="Small button group">
                <ToggleButton value="check" selected={isReverse} onChange={handleReverse}
                    color="primary">
                    <FastRewind />
                </ToggleButton>
                <ToggleButton value="check" selected={isLoop} onChange={handleLoop} color="primary">
                    <Repeat />
                </ToggleButton>
            </ButtonGroup>
            </Stack>
            <TextField 
                label="FPS" 
                error={isFPSError}
                value={inputFps} 
                onChange={handleFpsChange} 
                onBlur={handleCommitFpsChange} 
                onKeyDown={handleFPSEnter} 
                margin="dense" 
                fullWidth={true}
                {...(isFPSError ? { helperText: "Invalid FPS" } : {helperText:"Press Enter or exit the field to update the value"}) }
                />
            <Stack direction="row" spacing={1}>
                <Button onClick={handleSave} variant="contained" fullWidth={true}>Save</Button>
                <Button onClick={() => inputFile.current?.click()} variant="contained" fullWidth={true}>Load</Button>
                <input type='file' id='file' ref={inputFile} style={{ display: 'none' }} onChange={handleLoad} />
            </Stack>

        </div>
    );
}
