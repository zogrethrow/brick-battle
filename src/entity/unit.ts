import { ctx } from "../global";
import { GRID_SIZE } from "../playfield";
import Vector2 from "../vector2";
import EntityInterface from "../entity/entity_interface";
import { entityManager } from "../entity/entity_manager";

export default class Unit implements EntityInterface {
	#maxSpeed: number = GRID_SIZE * 1;
	#maxForce: number = this.#maxSpeed * 0.1;
	#maxAvoidanceForce: number = GRID_SIZE;
	#maxHorizon: number = GRID_SIZE * 5;
	#mass: number;
	#target: Vector2[] = [];
	#velocity: Vector2 = new Vector2(0, 0);
	#acceleration: Vector2 = new Vector2(0, 0);

	constructor(
		public position: Vector2,
		weight: number,
	) {
		this.#mass = weight;
	}

	setTarget(target: Vector2): void {
		this.#target = [target];
		console.log("Target set:", this.#target);
	}

	addTarget(target: Vector2): void {
		this.#target.push(target);
		console.log("Target added:", this.#target);
	}

	prependTarget(target: Vector2): void {
		this.#target.unshift(target);
		console.log("Target prepended:", this.#target);
	}

	process(deltatime: number): void {
		this.#walk(deltatime);
	}

	render(): void {
		let radius = GRID_SIZE * 0.5;
		ctx.moveTo(this.position.x, this.position.y);
		ctx.beginPath();
		ctx.fillStyle = "blue";
		ctx.arc(this.position.x, this.position.y, radius - 5, 0, Math.PI * 2);
		ctx.closePath();
		ctx.fill();
	}

	#walk(deltatime: number): void {
		const currentTarget = this.#target.at(0);
		if (!currentTarget) return;

		if (this.position.distanceTo(currentTarget) < GRID_SIZE * 0.05) {
			this.position = this.#target.shift()!;
			if (this.#target.length === 0) {
				this.#velocity = this.#velocity.mul(0);
				return;
			}
		}

		const desiredVelocity = this.#target.at(0)!.sub(this.position).normalize().mul(this.#maxSpeed);
		this.#acceleration = desiredVelocity.sub(this.#velocity).truncate(this.#maxForce).div(this.#mass);
		this.#velocity = this.#velocity.add(this.#acceleration).truncate(this.#maxSpeed);
		this.position = this.position.add(this.#velocity.mul(deltatime));
	}
}
