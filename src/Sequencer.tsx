import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import ButtonPad from './ButtonPad';
import * as Player from './Player'


const Sequencer: React.FC<SequencerProps> = (props) => {
    const COLS = props.columns
    const ROWS = props.pads.length

    const [grid, setGrid] = useState<number[][]>([...Array(ROWS).fill(Array(COLS).fill(0))])
    const [playing, setPlaying] = useState<boolean>(false);
    const [position, setPosition] = useState<number>(0);
    const [bpm, setBpm] = useState<number>(120);
    
    /* State variables for handling mouse drag. Would love suggestions on how to clean this up lol */
    // Row / column in which the drag is active:
    const [dragRow, setDragRow] = useState<number>(-1);
    const [dragCol, setDragCol] = useState<number>(-1);
    // Starting position (in Pixels) of the Y drag and what state the box is in at the beginning
    const [dragYStartPos, setDragYStartPos] = useState<number>(-1);
    const [dragYStartState, setDragYStartState] = useState<number>(0);
    // Whether or not a drag is actively happening in the y dimension
    const [draggingY, setDraggingY] = useState<boolean>(false);
    /* End drag-related state variables */

    const changeState = (r: number, c: number, value: number=-1) => {
        const newGrid = JSON.parse(JSON.stringify(grid)) // cheap stupid way to copy a 2D grid
        newGrid[r][c] = (value < 0) ? +!grid[r][c] : value;
        setGrid(newGrid)
    }

    const togglePlaying = () => { 
        playing ? Player.pause() : Player.play(position);
        setPlaying(!playing)
    };

    const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === " ") {
            togglePlaying();
            e.preventDefault();
        }
        else if (e.key === "Enter") {
            setPlaying(false); Player.reset();
        }
    }

    const resetDrag = (e: any) => {
        if (e.type == "mouseup") {
            setDragRow(-1);
            setDragCol(-1);
            setDragYStartPos(-1);
            setDraggingY(false);
        }
    }

    const startDrag = (e: any) => {
        setDragYStartPos(e.clientY);
    }

    const handleMouseMove = (e: any) => {
        const dist = -1 * Math.floor((e.clientY - dragYStartPos) / 30);
        if (dragYStartPos > -1 && dragRow > -1 && (draggingY || dist > 1 || dragYStartState > 1)) {
            const newGrid = JSON.parse(JSON.stringify(grid));
            newGrid[dragRow][dragCol] = dist - 1 + dragYStartState;
            setGrid(newGrid);
            setDraggingY(true);
        }
    }

    const handleBpmChange = (e: any) => {
        setBpm(e.target.value);
    }

    useEffect(() => {
        Player.init(ROWS, COLS, bpm, (position: number) => {
            setPosition(position);
        })
    }, []);

    useEffect(() => {
        Player.updateGrid(grid)
    }, [grid]);

    useEffect(() => {
        // Add event listener for keyboard shortcuts
        document.addEventListener('keydown', handleKeyPress);
        document.addEventListener('mouseup', resetDrag);
        document.addEventListener('mousemove', handleMouseMove);

        // Remove the event listener
        return () => {
          document.removeEventListener('keydown', handleKeyPress);
          document.removeEventListener('mouseup', resetDrag);
          document.removeEventListener('mousemove', handleMouseMove);
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
                            changeState={changeState}
                            state={grid[rowIdx][colIdx]}
                            playing={playing}
                            dragRow={dragRow}
                            setDragRow={setDragRow}
                            setDragCol={setDragCol}
                            setDragYStartState={setDragYStartState}
                            position={position}
                        />
                    </Grid>
                )
            })
    }
    const pads = props.pads.map((padName, rowIdx) => { return row(padName, rowIdx) })
    return (
        <div className="Sequencer" onMouseUp={resetDrag} onMouseDown={startDrag}>
            <div className="controls">
                <span className="btn" onClick={() => togglePlaying()}>{playing ? "⏸" : "▶"}</span>
                <span className="btn" onClick={() => {setPlaying(false); Player.reset()}}>⏹</span>
                <span>
                    <input type="range" min="50" max="180" defaultValue={bpm} className="slider" id="bpm" 
                        onChange={handleBpmChange} 
                        onMouseUp={() => Player.updateBpm(bpm)}
                        />
                </span>&nbsp;
                <span className="bpm">{bpm} BPM</span>
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