import { ctx } from "../global";
import { GRID_SIZE } from "../playfield";
import Vector2 from "../vector2";
import EntityInterface from "./entity_interface";
import * as Mouse from "../input/mouse.ts";
import { entityManager } from "./entity_manager";

export default class Unit implements EntityInterface {
  #maxVelocity: Vector2 = new Vector2(GRID_SIZE, GRID_SIZE);
  #maxForce: number = GRID_SIZE * 2;
  #maxVision: number = GRID_SIZE * 5;
  #maxAvoidForce: number = GRID_SIZE * 3;
  #target: null | Vector2 = null;
  #velocity: Vector2 = new Vector2(0, 0);
  #weight: number = 1;

  constructor(public position: Vector2, weight: number) {
    this.#weight = weight;
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
    if (Mouse.middle.pressed) {
      const x = Math.floor(Mouse.position.x / GRID_SIZE) * GRID_SIZE + GRID_SIZE * 0.5;
      const y = Math.floor(Mouse.position.y / GRID_SIZE) * GRID_SIZE + GRID_SIZE * 0.5;
      this.#target = new Vector2(x, y);
    }

    if (this.#target == null) return;
    if (this.position.x == this.#target.x && this.position.y == this.#target.y) return;

    let desiredVelocity = this.normalize(this.position, this.#target)
      .mulVec(this.#maxVelocity.mul(deltatime));

    let steering = desiredVelocity.sub(this.#velocity);
    steering = steering.add(this.#collisionAvoidance())

    if (steering.length > this.#maxForce) {
      steering = steering.normalize().mul(this.#maxForce);
    }

    steering = steering.div(this.#weight);

    this.#velocity = this.#velocity.add(steering);

    this.position = this.position.add(this.#velocity);
  }

  normalize(position: Vector2, target: Vector2): Vector2 {
    if (target.sub(position).length === 0) return new Vector2(0, 0);
    return target.sub(position).normalize();
  }

  #collisionAvoidance(): Vector2 {
    let ahead: Vector2 = this.position.add(this.#velocity.normalize()).mul(this.#maxVision);
    let ahead2: Vector2 = ahead.mul(0.5);

    let closestObstacle = this.#findClosestObstacle(ahead, ahead2);
    let avoidance: Vector2 = new Vector2(0, 0);

    if (closestObstacle === null) return avoidance;
    avoidance = this.normalize(ahead, closestObstacle.position).mul(this.#maxAvoidForce);

    return avoidance;
  }

  #findClosestObstacle(ahead: Vector2, ahead2: Vector2): null | EntityInterface {
    let closestObstacle: null | EntityInterface = null;
    let entities: Set<EntityInterface> = entityManager.getEntities();

    for (let entity of entities) {
      let collision: boolean = this.#entityIntersectsPath(ahead, ahead2, entity);

      if (collision && (closestObstacle == null || this.position.sub(entity.position).length < this.position.sub(closestObstacle.position).length)) {
        closestObstacle = entity;
      }
    }

    return closestObstacle;
  }

  #entityIntersectsPath(ahead: Vector2, ahead2: Vector2, entity: EntityInterface): boolean {
    if (entity === this) return false;
    let radius = GRID_SIZE * 0.5;
    return entity.position.distanceTo(ahead) <= radius || entity.position.distanceTo(ahead2) <= radius;
  }
}
