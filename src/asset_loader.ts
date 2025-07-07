type ProgressCallback = (progress: number, total: number) => void;
type Task = (task: Task) => void;

enum AUDIO_CODECS {
	mp3 = "audio/mp3",
	ogg = 'audio/ogg; codecs="vorbis"',
}

type AudioSource = { [K in keyof typeof AUDIO_CODECS]: string };

/**
 * Get a single element from an object, based on codecs.
 * Codecs availability is determined using the provided audio element.
 */
function getSupportedCodecs(audio: HTMLAudioElement, source: Partial<AudioSource>): string {
	// Store codec that MIGHT be playable
	let maybe: string | null = null;

	// Loop through available audio codecs for sound
	for (const key in source) {
		const codecName = key as keyof typeof AUDIO_CODECS;
		if (!source[codecName]) continue;
		const codec = AUDIO_CODECS[codecName];
		const result = audio.canPlayType(codec);

		// Browser can play this type, return that
		if (result === "probably") {
			return source[codecName];
		}

		// Browser might be able to play this, hang on to it
		if (result === "maybe") {
			maybe ??= source[codecName];
		}
	}

	// Return the sound with a codec that MIGHT be playable
	if (maybe) {
		return maybe;
	}

	// We just didn't find anything
	throw new Error("no supported codecs found");
}

export default class AssetLoader {
	#progress: number = 0;
	#total: number = 0;
	#complete: boolean = false;
	#started: boolean = false;

	#promise: Promise<void>;
	#promiseResolve: () => void;
	#promiseReject: (reason: Error) => void;

	#tasks: Set<Task> = new Set();
	#onProgress: ProgressCallback | null;

	get progress(): number {
		return this.#progress;
	}

	get complete(): boolean {
		return this.#complete;
	}

	constructor(onProgress: ProgressCallback | null = null) {
		this.#promiseResolve = () => {};
		this.#promiseReject = () => {};
		this.#promise = new Promise((resolve, reject) => {
			this.#promiseReject = reject;
			this.#promiseResolve = resolve;
		});

		this.#onProgress = onProgress;
	}

	#addTask(task: Task) {
		this.#total += 1;

		if (!this.#tasks.has(task)) {
			this.#tasks.add(task);
			if (this.#started) {
				task(task);
			}
		}
	}

	#endTask(task: Task) {
		this.#tasks.delete(task);

		this.#progress += 1;
		if (this.#onProgress) {
			this.#onProgress(this.#progress, this.#total);
		}

		if (this.#tasks.size === 0) {
			this.#complete = true;
			this.#promiseResolve();
		}
	}

	loadImage(url: string): Promise<HTMLImageElement> {
		return new Promise((resolve, reject) => {
			const img = new Image();
			this.#addTask((task) => {
				img.addEventListener("load", () => {
					this.#endTask(task);
					resolve(img);
				});

				img.addEventListener("error", () => {
					const error = new Error(`could not load image from "${url}"`);
					reject(error);
					this.#promiseReject(error);
				});

				img.src = url;
			});

			return img;
		});
	}

	loadText(url: string): Promise<string> {
		return new Promise((resolve, reject) => {
			this.#addTask((task) => {
				const request = fetch(url, {
					method: "GET",
				});

				request.then(async (response) => {
					const text = await response.text();

					this.#endTask(task);
					resolve(text);
				});

				request.catch(() => {
					const error = new Error(`could not load text from "${url}"`);
					reject(error);
					this.#promiseReject(error);
				});
			});
		});
	}

	loadSound(source: Partial<AudioSource>): Promise<HTMLAudioElement> {
		return new Promise((resolve, reject) => {
			const audio = new Audio();
			this.#addTask((task) => {
				const url = getSupportedCodecs(audio, source);

				audio.addEventListener("canplaythrough", (event) => {
					this.#endTask(task);
					resolve(audio);
				});

				audio.addEventListener("error", (event) => {
					const error = new Error(`could not load audio from "${url}"`);
					reject(error);
					this.#promiseReject(error);
				});

				audio.src = url;
				audio.load();
			});
			return audio;
		});
	}

	/**
	 * Begins loading.
	 * A promise is returned, that resolves when loading is done.
	 * If any assets fail to load, the promise is rejected.
	 */
	load(): Promise<void> {
		if (!this.#started) {
			this.#started = true;
			for (const task of this.#tasks.values()) {
				task(task);
			}
		}

		return this.#promise;
	}
}
