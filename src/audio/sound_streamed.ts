import { audioContext, Sound, Voice } from "./audio";

let dummySoundPlayed = false;

// We can't hide the MediaSession, so just overwrite its controls...
const ignoreEvents: MediaSessionAction[] = [
	"play",
	"pause",
	"seekbackward",
	"seekforward",
	"seekto",
	"previoustrack",
	"nexttrack",
	"skipad",
];
for (const eventType of ignoreEvents) {
	navigator.mediaSession.setActionHandler(eventType, () => {});
}

/**
 * A sound streamed through a <audio> object.
 * Uses less memory, but has higher potential load-times.
 * Used for music and longer audio clips.
 */
export class SoundStreamed implements Sound {
	playing: Set<VoiceStreamed> = new Set();

	constructor(public objectUrl: string) {}

	play(): Voice {
		// The browser is stupid...
		// Audio context or whatever doesn't want streamed audio as the first sound.
		// To get around this, play a dummy non-streamed sound first.
		// Afterwards we can play out streamed audio!
		// ...why is it like this though?
		if (!dummySoundPlayed) {
			const audioBufferNode = audioContext.createConstantSource();
			audioBufferNode.start();
			audioBufferNode.stop();
			dummySoundPlayed = true;
		}

		// Create audio element
		const audio = new Audio(this.objectUrl);

		// Create and play media source node
		const node = audioContext.createMediaElementSource(audio);
		node.connect(audioContext.destination);
		audio.play();

		// Create and return voice
		const voice = new VoiceStreamed(this, node);
		this.playing.add(voice);
		return voice;
	}

	stopAll() {
		for (const voice of this.playing) {
			voice.node.mediaElement.pause();
		}

		this.playing.clear();
	}
}

class VoiceStreamed implements Voice {
	constructor(
		public sound: SoundStreamed,
		public node: MediaElementAudioSourceNode,
	) {
		const audio = this.node.mediaElement;
		audio.onended = () => {
			this.#onStop();
		};
	}

	stop() {
		this.node.mediaElement.onended = null;
		this.node.mediaElement.pause();
		this.#onStop();
	}

	#onStop() {
		this.sound.playing.delete(this);
	}
}
