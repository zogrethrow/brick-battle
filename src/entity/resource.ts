import EntityInterface from "../interfaces/entity_interface.ts";
import { ctx } from "../global";
import { GRID_SIZE } from "../playfield";
import Vector2 from "../vector2";

export default class Resource implements EntityInterface {
	position: Vector2;

	constructor(position: Vector2) {
		this.position = position;
	}

	process(deltatime: number): void {}

	render(): void {
		ctx.moveTo(this.position.x, this.position.y);
		ctx.beginPath();
		ctx.fillStyle = "lime";
		ctx.fillRect(this.position.x + 5, this.position.y + 5, GRID_SIZE - 10, GRID_SIZE - 10);
		ctx.closePath();
		ctx.fill();
	}
}
