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


    const toggleState = (r: number, c: number) => {
        const newGrid = JSON.parse(JSON.stringify(grid)) // cheap stupid way to copy a 2D grid
        newGrid[r][c] = +!grid[r][c]
        setGrid(newGrid)
    }
    const togglePlaying = () => { 
        playing ? Player.pause() : Player.play(position);
        setPlaying(!playing)
    };

    const handleKeyPress = (e: KeyboardEvent)  => {
        if (e.key === " ") {
            togglePlaying();
            e.preventDefault();
        }
        else if (e.key === "Enter") setPosition(0);
    }

    useEffect(() => {
        Player.init(ROWS, COLS, 120, (position: number) => {
            setPosition(position);
        })
    }, []);

    useEffect(() => {
        Player.updateGrid(grid)
    }, [grid]);

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
                <span onClick={() => {setPlaying(false); Player.reset()}}>⏹</span>
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