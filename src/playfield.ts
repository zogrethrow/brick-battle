import { ctx } from "./global";
import EntityInterface from "./entity/entity_interface";
import * as Mouse from "./input/mouse";
import Vector2 from "./vector2";

export const GRID_SIZE = 32;

export enum PLAYFIELD_TILE {
	VACANT,
	SOLID,
}

export default class Playfield implements EntityInterface {
	#grid: PLAYFIELD_TILE[][];

	get width(): number {
		return this.#grid.length;
	}

	get height(): number {
		return this.#grid[0].length;
	}

	constructor(width: number, height: number) {
		if (width <= 0 || height <= 0) {
			throw new Error("cannot make a Playfield with width or height <= 0");
		}

		const column = new Array(height);
		for (let i = 0; i < height; i++) {
			column[i] = PLAYFIELD_TILE.VACANT;
		}

		this.#grid = new Array(width);
		for (let i = 0; i < width; i++) {
			this.#grid[i] = column.slice();
		}
	}

	getTile(x: number, y: number): PLAYFIELD_TILE {
		if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
			return PLAYFIELD_TILE.SOLID;
		}

		return this.#grid[x][y];
	}

	setTile(x: number, y: number, value: PLAYFIELD_TILE) {
		if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
			return;
		}

		this.#grid[x][y] = value;
	}

	saveState() {
		const state: { x: number; y: number; cell: number }[] = [];
		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				const cell = this.#grid[x][y];
				if (cell) {
					state.push({ x, y, cell });
				}
			}
		}

		const jsonState = JSON.stringify(state);
		window.localStorage.setItem("grid_state", jsonState);
	}

	loadState() {
		const jsonState = window.localStorage.getItem("grid_state");
		if (!jsonState) return;

		const state = JSON.parse(jsonState) as { x?: number; y?: number; cell?: PLAYFIELD_TILE }[];
		if (!(state instanceof Array)) return;

		for (const cellState of state) {
			const x = cellState.x ?? -1;
			const y = cellState.y ?? -1;
			const cell = cellState.cell ?? PLAYFIELD_TILE.VACANT;
			this.setTile(x, y, cell);
		}
	}

	process(deltaTime: number) {
		const mouseX = Math.floor(Mouse.position.x / GRID_SIZE);
		const mouseY = Math.floor(Mouse.position.y / GRID_SIZE);

		// if (Mouse.left.held) this.setTile(mouseX, mouseY, PLAYFIELD_TILE.SOLID);
		// if (Mouse.right.held) this.setTile(mouseX, mouseY, PLAYFIELD_TILE.VACANT);

		//if (Mouse.left.released || Mouse.right.released) {
		//  this.saveState();
		//}
	}

	render() {
		// Render grid outline
		ctx.strokeStyle = "black";
		ctx.beginPath();

		for (let i = 0; i < this.width + 1; i++) {
			ctx.moveTo(i * GRID_SIZE, 0);
			ctx.lineTo(i * GRID_SIZE, this.height * GRID_SIZE);
		}

		for (let i = 0; i < this.height + 1; i++) {
			ctx.moveTo(0, i * GRID_SIZE);
			ctx.lineTo(this.width * GRID_SIZE, i * GRID_SIZE);
		}

		ctx.stroke();

		// Render grid elements
		for (let i = 0; i < this.width; i++) {
			for (let j = 0; j < this.height; j++) {
				const x = i * GRID_SIZE;
				const y = j * GRID_SIZE;

				switch (this.getTile(i, j)) {
					case PLAYFIELD_TILE.SOLID: {
						ctx.fillStyle = "red";
						ctx.fillRect(x + 5, y + 5, GRID_SIZE - 10, GRID_SIZE - 10);
						break;
					}
				}
			}
		}
	}

	/**
	 * Given a start point and an end point (in world space).
	 * Returns the point along the ray, where there is an obstacle (if any).
	 */
	lineIntersection(start: Vector2, end: Vector2): Vector2 | null {
		// Form ray cast from player into scene
		const rayStart = start.div(GRID_SIZE);
		const rayEnd = end.div(GRID_SIZE);
		const rayDir = rayEnd.sub(rayStart).normalize();

		const rayLength = new Vector2(0, 0);
		const mapCheck = new Vector2(~~rayStart.x, ~~rayStart.y);
		const step = new Vector2(Math.sign(rayDir.x) || 1, Math.sign(rayDir.y) || 1);
		const rayUnitStepSize = new Vector2(
			Math.sqrt(1 + (rayDir.y / rayDir.x) * (rayDir.y / rayDir.x)),
			Math.sqrt(1 + (rayDir.x / rayDir.y) * (rayDir.x / rayDir.y)),
		);

		// Establish Starting Conditions
		if (rayDir.x < 0) {
			rayLength.x = (rayStart.x - mapCheck.x) * rayUnitStepSize.x;
		} else {
			rayLength.x = (mapCheck.x + 1 - rayStart.x) * rayUnitStepSize.x;
		}

		if (rayDir.y < 0) {
			rayLength.y = (rayStart.y - mapCheck.y) * rayUnitStepSize.y;
		} else {
			rayLength.y = (mapCheck.y + 1 - rayStart.y) * rayUnitStepSize.y;
		}

		// Perform "Walk" until collision or range check
		const maxDistance = rayStart.sub(rayEnd).length;
		let distance = 0;
		while (distance < maxDistance) {
			// Test tile at new test point
			if (this.getTile(mapCheck.x, mapCheck.y) === PLAYFIELD_TILE.SOLID) {
				return new Vector2(
					(rayStart.x + rayDir.x * distance) * GRID_SIZE,
					(rayStart.y + rayDir.y * distance) * GRID_SIZE,
				);
			}

			// Walk along shortest path
			if (rayLength.x < rayLength.y) {
				mapCheck.x += step.x;
				distance = rayLength.x;
				rayLength.x += rayUnitStepSize.x;
			} else {
				mapCheck.y += step.y;
				distance = rayLength.y;
				rayLength.y += rayUnitStepSize.y;
			}
		}

		return null;
	}
}
