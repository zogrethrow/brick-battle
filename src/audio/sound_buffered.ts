import { audioContext, Sound, Voice } from "./audio";

/**
 * A sound played from a decoded AudioBuffer.
 * Has a higher memory footprint, but playback is basically instant.
 * Used for sound effects and shorter audio clips.
 */
export default class SoundBuffered implements Sound {
	playing: Set<VoiceBuffered> = new Set();

	constructor(public buffer: AudioBuffer) {}

	play(): VoiceBuffered {
		// Create and play buffer source
		const node = audioContext.createBufferSource();
		node.buffer = this.buffer;
		node.connect(audioContext.destination);
		node.start();

		// Create and return voice
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

class VoiceBuffered implements Voice {
	constructor(
		public sound: SoundBuffered,
		public node: AudioBufferSourceNode,
	) {
		this.node.onended = () => {
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
