import EntityInterface from "./interfaces/entity_interface.ts";
import Vector2 from "./vector2.ts";
import TileInterface from "./interfaces/tile_interface.ts";
import Playfield from "./playfield.ts";

export default interface GameInterface {
	// Game loop
	tick(deltatime: number): void;

	// Entity-related methods
	getEntities(): EntityInterface[];
	selectEntityAtTile(position: Vector2): EntityInterface | null;
	addEntity(entity: EntityInterface): EntityInterface;
	removeEntity(entity: EntityInterface): void;

	// Playfield-related methods
	getPlayfield(): Playfield;
}
