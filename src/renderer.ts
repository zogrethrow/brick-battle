import { ctx } from "./global";
import Vector2 from "./vector2";
import GameInterface from "./game_interface";
import { TerrainType } from "./interfaces/tile_interface";

export const GRID_SIZE = 32;

export class Renderer {
  #game: GameInterface;
  #selectedEntityId: string | null = null;

  constructor(game: GameInterface) {
    this.#game = game;
  }

  render(): void {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.#renderPlayfield();
    this.#renderEntities();
  }

  setSelectedEntity(id: string | null): void {
    this.#selectedEntityId = id;
  }

  #renderPlayfield(): void {
    const playfield = this.#game.getPlayfield();
    for (let x = 0; x < playfield.width; x++) {
      for (let y = 0; y < playfield.height; y++) {
        const tile = playfield.getTile(new Vector2(x, y));
        ctx.beginPath();
        ctx.fillStyle = this.#getTerrainColor(tile.terrain);
        ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        ctx.strokeStyle = "black";
        ctx.strokeRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        ctx.closePath();
      }
    }
  }

  #renderEntities(): void {
    const entities = this.#game.getEntities();
    for (const entity of entities) {
      ctx.beginPath();
      ctx.fillStyle = "red";
      ctx.arc(entity.position.x * GRID_SIZE + GRID_SIZE / 2, entity.position.y * GRID_SIZE + GRID_SIZE / 2, GRID_SIZE * 0.5 - 5, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();

      if (entity.id === this.#selectedEntityId) {
        ctx.beginPath();
        ctx.strokeStyle = "yellow";
        ctx.arc(entity.position.x * GRID_SIZE + GRID_SIZE / 2, entity.position.y * GRID_SIZE + GRID_SIZE / 2, GRID_SIZE * 0.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
      }
    }
  }

  #getTerrainColor(terrain: TerrainType): string {
    switch (terrain) {
      case TerrainType.GRASS: return "green";
      case TerrainType.WATER: return "blue";
      case TerrainType.ROCK: return "gray";
      case TerrainType.MOUNTAIN: return "brown";
      case TerrainType.TREE: return "darkgreen";
      default: return "green";
    }
  }
}