import React, { useState } from 'react';
import { Grid } from '@mui/material';
import ButtonPad from './ButtonPad';


const Sequencer: React.FC<SequencerProps> = (props) => {
    const COLS = props.columns
    const ROWS = props.pads.length

    const [grid, setGrid] = useState<boolean[][]>([...Array(ROWS).fill(Array(COLS).fill(false))])

    const toggleState = (r: number, c: number) => {
        const newGrid = JSON.parse(JSON.stringify(grid)) // cheap stupid way to copy a 2D grid
        newGrid[r][c] = !grid[r][c]
        setGrid(newGrid)
    }

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
                        />
                    </Grid>
                )
            })
    }
    const pads = props.pads.map((padName, rowIdx) => { return row(padName, rowIdx) })
    return (
        <Grid className="Sequencer" container spacing={2} columns={props.columns}>
            {pads}
        </Grid>
    )
}

export interface SequencerProps {
    pads: string[]
    columns: number,
}

export default Sequencer;