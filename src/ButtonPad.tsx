import { Card, Typography } from "@mui/material"

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
    toggleState
}) => {
    const playSound = () => {
        const url = drum_808.get(padName)
        if (url) {
            new Audio(url).play()
        }
        toggleState(row, col)
    }
    const style = state ? { backgroundColor: 'red' } : { backgroundColor: 'white' }
    return (
        <Card style={style} className="pad" variant="outlined" onClick={() => { playSound() }}>
            <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
                {padName}
            </Typography>
        </Card>
    )
}

export interface ButtonPadProps {
    row: number,
    col: number,
    state: boolean,
    padName: string
    toggleState: (r: number, c: number) => void,
}

export default ButtonPad;