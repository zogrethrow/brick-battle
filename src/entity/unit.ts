import Vector2 from "../vector2";
import EntityInterface from "../interfaces/entity_interface";

export default class Unit implements EntityInterface {
	#maxSpeed: number = 1;
	#maxForce: number = this.#maxSpeed * 0.1;
	#maxAvoidanceForce: number = 1;
	#maxHorizon: number = 5;
	#mass: number;
	#target: Vector2[] = [];
	#velocity: Vector2 = new Vector2(0, 0);
	#acceleration: Vector2 = new Vector2(0, 0);
	public id: string = "";

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

	process(deltaTime: number): void {
		this.#walk(deltaTime);
	}

	#walk(deltaTime: number): void {
		const currentTarget = this.#target.at(0);
		if (!currentTarget) return;

		if (this.position.distanceTo(currentTarget) < 0.05) {
			this.position = this.#target.shift()!;
			if (this.#target.length === 0) {
				this.#velocity = this.#velocity.mul(0);
				return;
			}
		}

		const desiredVelocity = this.#target.at(0)!.sub(this.position).normalize().mul(this.#maxSpeed);
		this.#acceleration = desiredVelocity.sub(this.#velocity).truncate(this.#maxForce).div(this.#mass);
		this.#velocity = this.#velocity.add(this.#acceleration).truncate(this.#maxSpeed);
		this.position = this.position.add(this.#velocity.mul(deltaTime));
	}
}