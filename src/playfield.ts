import { ctx } from "./global.ts";

export const GRID_SIZE = 32;

export enum PLAYFIELD_TILE {
    VACANT,
    SOLID,
};

export default class Playfield {
    #grid: PLAYFIELD_TILE[][];

    get width(): number {
        return this.#grid.length;
    }

    get height(): number {
		return this.#grid[0].length;
    }

    constructor(width: number, height: number) {
        if (width <= 0 || height <= 0) {
            throw new Error("cannot make a Playfield with widh or height <= 0");
        }

        const column = new Array(height);
        for (let i = 0; i < height; i++) {
            column[i] = PLAYFIELD_TILE.VACANT;
        }

        this.#grid = new Array(width);
        for (let i = 0; i < width; i++) {
            this.#grid[i] = column.slice();
        }

		this.setTile(1, 1, PLAYFIELD_TILE.SOLID);
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

	process(deltaTime: number) {
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
						ctx.fillStyle = "lime";
						ctx.fillRect(x+5, y+5, GRID_SIZE-10, GRID_SIZE-10);
						break;
					}
				}
			}
		}
	}
}
