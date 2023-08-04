import * as Tone from 'tone'

const blank = new Tone.Player('./assets/808/blank.wav').toDestination();

const drum_filenames = ['hh_closed', 'hh_open', 'snare', 'kick', 'clap', 'tom', 'cymbal'];
let drums = drum_filenames.map(
	(name) => new Tone.Player('./assets/808/' + name + '.wav').toDestination());

let grid: number[][];
let position: number = 0;
let bpm: number;
let positionUpdateCallback: Function;
let playStartTime: number = -1;
let nextStepTime: number = -1;
let schedulerInterval: ReturnType<typeof setInterval>;
let startStep = 0;
let lastStepDrawn: number = -1;

const bpmToInterval = (bpm: number) => 15 / bpm;

export function init(rows: number, cols: number, newBpm: number, newPositionUpdateCallback: Function) {
	grid = [...Array(rows).fill(Array(cols).fill(0))];
	bpm = newBpm;
	position = 0;
	positionUpdateCallback = newPositionUpdateCallback;
	playStartTime = -1;
}

export function updatePosition(newPosition: number) {
	position = newPosition;
	positionUpdateCallback(position);
	if (playStartTime >= 0) {
		pause();
		play(newPosition, true);
	}
}

export function updateGrid(newGrid: number[][]) {
	grid = newGrid;
}
export function updateBpm(newBpm: number) {
	bpm = newBpm;
	if (playStartTime >= 0) {
		pause();
		play((startStep + position) % 16);
	}
}

export function play(startStepAt: number = 0, bpmChange: boolean = false) {
	console.log("PLAY");
	position = 0;
	schedulerInterval = setInterval(scheduler, 100);
	startStep = startStepAt;
	playStartTime = Tone.now();
	blank.start(); // This is necessary. Dunno why.
	if (!bpmChange) playStep(startStep);

	window.requestAnimationFrame(draw);
}

export function draw() {
	if (lastStepDrawn < nextStepTime && nextStepTime <= Tone.now()) {
		lastStepDrawn = nextStepTime;
		positionUpdateCallback((startStep + position) % 16);
	}
	window.requestAnimationFrame(draw);

}

export function scheduler() {
	//If next step is already scheduled, then return
	if (nextStepTime > Tone.now()) return;
	if (playStartTime > -1) {
		position += 1;
		nextStepTime = playStartTime + bpmToInterval(bpm) * position;
		playStep((startStep + position) % 16, nextStepTime);
	}
}

export function playStep(step: number, time: number = -1) {
	for (let i = 0; i < grid.length; i++) {
		if (!grid[i][step]) continue;
		if (time > Tone.now()) {
			for (let j = 0; j < grid[i][step]; j++)
				drums[i].start(time + j * bpmToInterval(bpm)  / grid[i][step]);
		} else {
			drums[i].start();
		}
	}
}

export function pause() {
	console.log("PAUSING");
	playStartTime = -1;
	clearInterval(schedulerInterval);
}

export function reset() {
	pause();
	position = 0;
	positionUpdateCallback(0);
}