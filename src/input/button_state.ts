export default class ButtonState {
	/**
	 * What state should the button have next frame?
	 */
	#next: boolean = false;

	/**
	 * Is button held this frame?
	 */
	#current: boolean = false;

	/**
	 * Was button held last frame?
	 */
	#previous: boolean = false;

	/**
	 * Was button held last frame?
	 */
	get held(): boolean {
		return this.#current;
	}

	/**
	 * Was button just pressed this frame?
	 */
	get pressed(): boolean {
		return this.#current && !this.#previous;
	}

	/**
	 * Was button just released this frame?
	 */
	get released(): boolean {
		return !this.#current && this.#previous;
	}

	/**
	 * Set which state the button should have next frame
	 */
	set next(state: boolean) {
		this.#next = state;
	}

	/**
	 * Must be called once every frame
	 */
	update() {
		this.#previous = this.#current;
		this.#current = this.#next;
	}
}
