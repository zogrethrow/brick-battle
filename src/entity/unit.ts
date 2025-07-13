import { ctx } from "../global";
import { GRID_SIZE } from "../playfield";
import Vector2 from "../vector2";
import EntityInterface from "../entity/entity_interface";
import { entityManager } from "../entity/entity_manager";

export default class Unit implements EntityInterface {
  #maxSpeed: number = GRID_SIZE * 1;
  #maxForce: number = this.#maxSpeed * 0.1; // or lower for smoother movement
  #mass: number;
  #target: null | Vector2 = null;
  #velocity: Vector2 = new Vector2(0, 0);
  #acceleration: Vector2 = new Vector2(0, 0);
  #ahead: Vector2;
  #ahead2: Vector2;

  constructor(public position: Vector2, weight: number) {
    this.#mass = weight;
    this.#ahead = position;
    this.#ahead2 = position;
  }

  move(target: Vector2): void {
    this.#target = target;
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
    if (this.#target == null) return;
    if (this.position.x == this.#target.x && this.position.y == this.#target.y) return;
    if (this.position.distanceTo(this.#target) < GRID_SIZE * 0.05) {
      this.position = this.#target;
      this.#target = null;
      return;
    }

    const desiredVelocity = this.#target.sub(this.position).normalize().mul(this.#maxSpeed);

    this.#acceleration = desiredVelocity.sub(this.#velocity).truncate(this.#maxForce).div(this.#mass);
    this.#velocity = this.#velocity.add(this.#acceleration).truncate(this.#maxSpeed);
    this.position = this.position.add(this.#velocity.mul(deltatime));
  }
}
