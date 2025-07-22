import Vector2 from "../vector2";
import Playfield from "../playfield";
import EntityInterface from "../interfaces/entity_interface";

export default class EntityManager {
	#entities: Map<string, EntityInterface> = new Map();
	#playfield: Playfield | null = null;
	#nextId: number = 1;

	addPlayfield(playfield: Playfield): void {
		this.#playfield = playfield;
	}

	add(entity: EntityInterface): void {
		const id = `entity_${this.#nextId++}`;
		(entity as any).id = id;
		this.#entities.set(id, entity);
	}

	remove(entity: EntityInterface): void {
		this.#entities.delete((entity as any).id);
	}

	getEntities(): EntityInterface[] {
		return Array.from(this.#entities.values());
	}

	getEntityAtPosition(coordinates: Vector2): EntityInterface | null {
		for (const entity of this.#entities.values()) {
			const gridPos = new Vector2(Math.floor(entity.position.x), Math.floor(entity.position.y));
			if (gridPos.x === coordinates.x && gridPos.y === coordinates.y) {
				return entity;
			}
		}
		return null;
	}

	process(deltaTime: number): void {
		this.#playfield?.process(deltaTime);
		this.#entities.forEach((entity: EntityInterface): void => entity.process(deltaTime));
	}
}