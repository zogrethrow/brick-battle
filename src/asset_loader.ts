import { audioContext } from "./audio/audio";
import { Sound } from "./audio/audio";
import SoundBuffered from "./audio/sound_buffered";
import { SoundStreamed } from "./audio/sound_streamed";

export async function loadBitmap(url: string): Promise<ImageBitmap> {
	const response = await fetch(url);
	const blob = await response.blob();

	return createImageBitmap(blob, { colorSpaceConversion: "none" });
}

export async function loadSound(url: string): Promise<Sound> {
	const response = await fetch(url);
	const audioData = await response.arrayBuffer();

	const audioBuffer = await audioContext.decodeAudioData(audioData);
	return new SoundBuffered(audioBuffer);
}

export async function loadMusic(url: string): Promise<Sound> {
	const respone = await fetch(url);
	const audioData = await respone.blob();

	const audioUrl = URL.createObjectURL(audioData);
	return new SoundStreamed(audioUrl);
}

export async function loadText(url: string): Promise<string> {
	const response = await fetch(url);
	return response.text();
}

export async function loadBytes(url: string): Promise<ArrayBuffer> {
	const response = await fetch(url);
	return response.arrayBuffer();
}

export default class AssetLoader {
	#tasks: Array<() => Promise<void>> = [];

	/**
	 *
	 * @param task
	 * @returns
	 */
	addTask<T>(task: () => Promise<T>): Promise<T> {
		return new Promise((resolve, reject) => {
			this.#tasks.push(async () => {
				const promise = task();
				promise.then(resolve);
				promise.catch(reject);
				await promise;
			});
		});
	}

	/**
	 * Begins loading.
	 * A promise is returned, that resolves when loading is done.
	 * If any assets fail to load, the promise is rejected.
	 *
	 * This also resets the state of the AssetLoader, so it can be reused.
	 */
	async load(onProgress: ((loaded: number, total: number) => void) | null = null): Promise<void> {
		const tasks = this.#tasks;
		this.#tasks = [];

		const promises: Array<Promise<void>> = new Array(tasks.length);
		let i = 0;
		let progress = 0;
		for (const task of tasks) {
			const promise = task();
			promises[i++] = promise;

			// Notify that something happened
			if (onProgress) {
				promise.then(() => {
					onProgress(++progress, tasks.length);
				});
			}
		}

		await Promise.all(promises);
	}
}
