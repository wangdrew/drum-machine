import React, { useState } from 'react';
import { Grid } from '@mui/material';
import ButtonPad from './ButtonPad';

const Sequencer: React.FC<SequencerProps> = (props) => {
    const COLS = props.columns
    const ROWS = props.pads.length

    // TODO: this will keep state (active = true/false) of each button pad
    // currently not hooked up to anything
    const [grid, setGrid] = useState([...Array(ROWS).fill(Array(COLS).fill({ active: false }))])

    const row = (padName: string) => {
        return [...Array(props.columns)]
            .map((x, i) => {
                return (
                    <Grid key={`${padName}-${i}`} item xs={1} >
                        <ButtonPad padName={padName} />
                    </Grid>
                )
            })
    }
    const pads = props.pads.map((padName, idx) => { return row(padName) })
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