import Vector2 from "./vector2";
import TileInterface, { TerrainType } from "./interfaces/tile_interface";

export default class Playfield {
	#map: Map<string, TileInterface>;
	#width: number;
	#height: number;

	constructor(width: number, height: number) {
		if (width <= 0 || height <= 0) {
			throw new Error("Cannot make a Playfield with width or height <= 0");
		}

		this.#width = width;
		this.#height = height;
		this.#map = new Map<string, TileInterface>();

		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height; y++) {
				this.#map.set(this.#key(x, y), { terrain: TerrainType.GRASS });
			}
		}
	}

	get width(): number {
		return this.#width;
	}

	get height(): number {
		return this.#height;
	}

	getTile(position: Vector2): TileInterface {
		if (position.x < 0 || position.y < 0 || position.x >= this.#width || position.y >= this.#height) {
			return { terrain: TerrainType.MOUNTAIN };
		}

		const tile = this.#map.get(this.#key(position.x, position.y));
		return tile || { terrain: TerrainType.GRASS };
	}

	setTile(position: Vector2, tile: TileInterface): void {
		if (position.x < 0 || position.y < 0 || position.x >= this.#width || position.y >= this.#height) {
			return;
		}

		this.#map.set(this.#key(position.x, position.y), tile);
	}

	isTilePassable(position: Vector2): boolean {
		const tile = this.getTile(position);
		return tile.terrain === TerrainType.GRASS || tile.terrain === TerrainType.WATER;
	}

	process(deltaTime: number): void {
		// Mouse handling in main loop
	}

	#key(x: number, y: number): string {
		return `${Math.floor(x)},${Math.floor(y)}`;
	}
}