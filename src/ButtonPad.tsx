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

const ButtonPad: React.FC<ButtonPadProps> = (props) => {
    const playSound = () => {
        const url = drum_808.get(props.padName)
        if (url) {
            console.log(url)
            new Audio(url).play()
        }
    }
    return (
        <Card variant="outlined" onClick={() => {playSound()}}>
            <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
                {props.padName}
            </Typography>
        </Card>
    )
}

export interface ButtonPadProps {
    padName: string
}

export default ButtonPad;