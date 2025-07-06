import EntityInterface from "./entity/entity_interface";
import { ctx } from "./global";
import Playfield, { GRID_SIZE, PLAYFIELD_TILE } from "./playfield";
import Vector2 from "./vector2";

export default class Pathfinding implements EntityInterface {
  #mapWidth: number;
  #mapHeight: number;
  #map: Playfield;
  #waypoints: Vector2[] = [];
 
  constructor(map: Playfield) {
    this.#mapWidth = map.width;
    this.#mapHeight = map.height;
    this.#map = map;
    this.calculateInitialWaypoints();
  }

  calculateInitialWaypoints() {
    for (let x = 0; x < this.#mapWidth; x++) {
      for (let y = 0; y < this.#mapHeight; y ++) {
        let tile = this.#map.getTile(x, y);
        if (tile === PLAYFIELD_TILE.SOLID) {
          if (
            this.#map.getTile(x + 1, y) != PLAYFIELD_TILE.SOLID 
            && this.#map.getTile(x, y + 1) != PLAYFIELD_TILE.SOLID
            && this.#map.getTile(x + 1, y + 1) != PLAYFIELD_TILE.SOLID
          ) {
            this.#waypoints.push(new Vector2(x + 1, y + 1));
          }
          if (
            this.#map.getTile(x + 1, y) != PLAYFIELD_TILE.SOLID 
            && this.#map.getTile(x, y - 1) != PLAYFIELD_TILE.SOLID
            && this.#map.getTile(x + 1, y - 1) != PLAYFIELD_TILE.SOLID
          ) {
            this.#waypoints.push(new Vector2(x + 1, y - 1));
          }
          if (
            this.#map.getTile(x - 1, y) != PLAYFIELD_TILE.SOLID 
            && this.#map.getTile(x, y - 1) != PLAYFIELD_TILE.SOLID
            && this.#map.getTile(x - 1, y - 1) != PLAYFIELD_TILE.SOLID
          ) {
            this.#waypoints.push(new Vector2(x - 1, y - 1));
          }
          if (
            this.#map.getTile(x - 1, y) != PLAYFIELD_TILE.SOLID 
            && this.#map.getTile(x, y + 1) != PLAYFIELD_TILE.SOLID
            && this.#map.getTile(x - 1, y + 1) != PLAYFIELD_TILE.SOLID
          ) {
            this.#waypoints.push(new Vector2(x - 1, y + 1));
          }
        }
      }
    }
  }

  process(deltatime: number): void {
    this.#waypoints = [];
    this.calculateInitialWaypoints();
  }

  render(): void {
    for (const waypoint of this.#waypoints) {
      ctx.moveTo(waypoint.x * GRID_SIZE, waypoint.y * GRID_SIZE);
      ctx.beginPath();
      ctx.arc(waypoint.x * GRID_SIZE + (GRID_SIZE / 2), waypoint.y * GRID_SIZE + (GRID_SIZE / 2), (GRID_SIZE / 4), 0, Math.PI * 2 );
      ctx.fillStyle = "red";
      ctx.closePath();
      ctx.fill();
    }
  }
}
