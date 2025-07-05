import { ctx } from "../global";
import Playfield, { GRID_SIZE } from "../playfield";
import Vector2 from "../vector2";
import EntityInterface from "./entity_interface";
import * as Mouse from "../input/mouse.ts";

export default class Unit implements EntityInterface {
  #target: null | Vector2 = null;
  #speed: number = GRID_SIZE;

  constructor(public position: Vector2) {}

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
    ctx.arc(this.position.x, this.position.y, radius - 5, 0, Math.PI*2);
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


    let distanceX = this.#target.x - this.position.x;
    let distanceY = this.#target.y - this.position.y;
    const distanceLeft = Math.sqrt((distanceX * distanceX) + (distanceY + distanceY));
    const moveBy = this.#speed * deltatime;

    if (distanceLeft <= moveBy) {
      this.position.x = this.#target.x;
      this.position.y = this.#target.y;
      this.#target = null;
      return;
    }

    let direction = Math.atan2(distanceY, distanceX);

    this.position.x += Math.cos(direction) * moveBy;
    this.position.y += Math.sin(direction) * moveBy;
  }
}
