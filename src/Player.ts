import * as Tone from 'tone'

const hh_close = new Tone.Player('./assets/808/hh_closed.wav').toDestination();
//hh_close.autostart = false;

const bpmToInterval = (bpm: number) => 15 / bpm;

class Player {
	grid: number[][];
	position: number;
	bpm: number;
	positionUpdateCallback: Function;
	playStartTime: number;
	nextStepTimeout: ReturnType<typeof setTimeout>;

	constructor(rows: number, cols: number, bpm: number, positionUpdateCallback: Function) {
		this.grid = [...Array(rows).fill(Array(cols).fill(0))];
		this.bpm = bpm;
		this.position = 0;
		this.positionUpdateCallback = positionUpdateCallback;
		this.playStartTime = -1;
		this.nextStepTimeout = setTimeout(() => {}, 0); //There must be a better way to initialize this
	}

	updatePosition(position: number) {
		this.position = position;
		this.positionUpdateCallback(position);
	}

	updateGrid(grid: number[][]) {
		this.grid = grid;
	}
	updateBpm(bpm: number) {
		this.bpm = bpm;
	}

	play() {
		this.playStartTime = Tone.now();
		hh_close.start();
		console.log("PLAY");
		this.scheduleNextStep();
	}

	/* 	Schedule next 16th note to be played + set a recursive timeout to schedule the next 16th note.
	   	This works for generating precise 16th notes, but for some reason there's no way to stop the recursion and it goes into infinite loop.
	   	Calling pause() should clear the timeout and set playStartTime to -1, but even after calling pause that doesn't happen
	 */
	scheduleNextStep() {
		if (this.playStartTime < 0) return; //Workaround since clearTimeout does not work
		this.updatePosition(this.position + 1);
		console.log("SCHEDULING: " + this.position);
		hh_close.start(this.playStartTime + bpmToInterval(this.bpm) * this.position);
		this.nextStepTimeout = setTimeout(this.scheduleNextStep.bind(this), bpmToInterval(this.bpm) * 1000);
	}

	pause() {
		console.log("PAUSING");
		// The log statement above is getting called, but for some reason the two below statements do nothing
		this.playStartTime = -1;
		clearTimeout(this.nextStepTimeout);
		// Even after this, scheduleNextStep continues to run and schedule more Timeouts. I HAVE NO IDEA WHY (!!!)
	}

	reset() {
		this.pause();
		this.position = 0;
		this.positionUpdateCallback(0);
	}


}

export default Player;