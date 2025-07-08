import { audioContext, Sound, Voice } from "./audio";

export default class SoundBuffered implements Sound {
	playing: Set<VoiceBuffered> = new Set();

	constructor(public buffer: AudioBuffer) {}

	play(): VoiceBuffered {
		const node = audioContext.createBufferSource();
		node.buffer = this.buffer;
		node.connect(audioContext.destination);
		node.start();

		const voice = new VoiceBuffered(this, node);
		this.playing.add(voice);
		return voice;
	}

	stopAll() {
		for (const voice of this.playing) {
			voice.node.stop();
		}

		this.playing.clear();
	}
}

export class VoiceBuffered implements Voice {
	constructor(
		public sound: SoundBuffered,
		public node: AudioBufferSourceNode,
	) {
		this.node.onended = () => {
			console.log("sound ended");
			this.#onStop();
		};
	}

	stop() {
		this.node.onended = null;
		this.node.stop();
		this.#onStop();
	}

	#onStop() {
		this.sound.playing.delete(this);
	}
}
