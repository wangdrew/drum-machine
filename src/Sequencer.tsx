import React, { useState, useEffect, useRef } from 'react';
import { Grid, Slider } from '@mui/material';
import ButtonPad from './ButtonPad';
import usePulse from './Pulse';


const Sequencer: React.FC<SequencerProps> = (props) => {
    const COLS = props.columns
    const ROWS = props.pads.length

    const [grid, setGrid] = useState<boolean[][]>([...Array(ROWS).fill(Array(COLS).fill(false))])
    const [playing, setPlaying] = useState<boolean>(false);
    const [position, setPosition] = useState<number>(0);
    const [bpm, setBpm] = useState<number>(100);

    const toggleState = (r: number, c: number) => {
        const newGrid = JSON.parse(JSON.stringify(grid)) // cheap stupid way to copy a 2D grid
        newGrid[r][c] = !grid[r][c]
        setGrid(newGrid)
    }

    const onTrigger = () => {
        setPosition(position => ((position + 1) % 16))
    }

    const { startPulse, stopPulse } = usePulse({ onTrigger, BPM: bpm });

    const togglePlaying = () => {
        if (playing) {
            setPlaying(false)
            stopPulse()
        } else {
            setPlaying(true)
            startPulse()
        }
    }

    const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === " ") {
            togglePlaying();
            e.preventDefault();
        }
        else if (e.key === "Enter") setPosition(0);
    }

    useEffect(() => {
        // Add event listener for keyboard shortcuts
        document.addEventListener('keydown', handleKeyPress);

        // Remove the event listener
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress])



    const row = (padName: string, rowIdx: number) => {
        return [...Array(props.columns)]
            .map((x, colIdx) => {
                return (
                    <Grid key={`${padName}-${colIdx}`} item xs={1} >
                        <ButtonPad
                            row={rowIdx}
                            col={colIdx}
                            padName={padName}
                            toggleState={toggleState}
                            state={grid[rowIdx][colIdx]}
                            playing={playing}
                            position={position}
                        />
                    </Grid>
                )
            })
    }
    const pads = props.pads.map((padName, rowIdx) => { return row(padName, rowIdx) })
    return (
        <div className="Sequencer">
            <div className="controls">
                <span onClick={() => togglePlaying()}>{playing ? "⏸" : "▶"}</span>
                <span onClick={() => {
                    setPosition(0)
                    setPlaying(false)
                    stopPulse()
                }}>⏹</span>
                <Slider
                    style={{ width: '200px' }}
                    aria-label="bpm"
                    defaultValue={100}
                    valueLabelDisplay="on"
                    step={1}
                    min={30}
                    max={250}
                    onChange={(_, newVal) => {
                        stopPulse()
                        setBpm(newVal as number)
                        startPulse()
                    }}
                />
            </div>
            <Grid container spacing={2} columns={props.columns}>
                {pads}
            </Grid>
        </div>
    )
}

export interface SequencerProps {
    pads: string[]
    columns: number,
}

export default Sequencer;