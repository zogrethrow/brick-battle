export const audioContext = new AudioContext();

/**
 * A sound asset that can be played.
 */
export interface Sound {
	/**
	 * Play this sound.
	 * A voice object is returned.
	 */
	play(): Voice;

	/**
	 * Stops all instances of this sound immediately.
	 */
	stopAll(): void;
}

/**
 * An instance of a playing sound.
 */
export interface Voice {
	/**
	 * Stop this voice from playing.
	 */
	stop(): void;
}
