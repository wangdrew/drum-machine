import { Card, Typography } from "@mui/material"
import { useEffect } from 'react';

import hh_closed from './assets/808/hh_closed.wav'
import hh_open from './assets/808/hh_open.wav'
import snare from './assets/808/snare.wav'
import kick from './assets/808/kick.wav'
import clap from './assets/808/clap.wav'
import tom from './assets/808/tom.wav'
import crash from './assets/808/cymbal.wav'


const drum_808: Map<string, string> = new Map<string, string>([
    ['hh_close', hh_closed],
    ['hh_open', hh_open],
    ['snare', snare],
    ['kick', kick],
    ['clap', clap],
    ['tom', tom],
    ['crash', crash]
])
const ButtonPad: React.FC<ButtonPadProps> = ({
    row,
    col,
    state,
    padName,
    changeState,
    playing,
    dragRow,
    setDragRow,
    setDragCol,
    setDragYStartState,
    position
}) => {
    const playSound = () => {
        const url = drum_808.get(padName)
        if (url) {
            new Audio(url).play()
        }
    }
    const mouseDown = () => {
        // Preview the sound when clicking on it if not playing
        if (!playing && dragRow === -1) playSound();
        
        // If state is binary then toggle it
        if (state < 2) changeState(row, col);
        
        // Start drag event
        setDragRow(row);
        setDragCol(col);
        setDragYStartState(state);
    }
    const stopDrag = () => {
        setDragRow(-1);
        setDragCol(-1);
    }
    const onHover = () => {
        if (dragRow === row) mouseDown();
    }
    const onClick = () => {
        //If state is non-binary, toggle it only onClick so it doesn't interfere with the drag
        if (state >= 2) changeState(row, col);
    }

    

    //Compute styles
    let bgColor = 'white';
    if (position == col) bgColor = playing ? '#CCC' : '#DDD';
    if (state) bgColor = 'aquamarine';
    let style = {backgroundColor: bgColor}
    if (col % 4 == 0) style = {...style, ...{borderLeftWidth: 3}};

    return (
        <Card style={style} className="pad" variant="outlined" onMouseDown={mouseDown} onClick={onClick} onMouseUp={stopDrag} onMouseEnter={onHover}>
        <p className="cnt">{state > 1 ? state : ''}</p>
            <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
                {padName}
            </Typography>
        </Card>
    )
}

export interface ButtonPadProps {
    row: number,
    col: number,
    state: number,
    padName: string,
    changeState: (r: number, c: number) => void,
    playing: boolean,
    dragRow: number,
    setDragRow: (r: number) => void,
    setDragCol: (r: number) => void,
    setDragYStartState: (r: number) => void,
    position: number,
}

export default ButtonPad;