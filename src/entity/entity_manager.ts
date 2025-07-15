import Playfield from "../playfield";
import Vector2 from "../vector2";
import EntityInterface from "./entity_interface";

class EntityManager {
	#entities: Map<string, EntityInterface> = new Map<string, EntityInterface>();
	#playfield: null | Playfield = null;

	add(entity: EntityInterface) {
		this.#entities.set(entity.position.toKey(), entity);
	}

	addPlayfield(playfield: Playfield) {
		this.#playfield = playfield;
	}

	remove(entity: EntityInterface) {
		this.#entities.delete(entity.position.toKey());
	}

	getEntityAtPosition(coordinates: Vector2): EntityInterface | null {
		return this.#entities.get(coordinates.toKey()) ?? null;
	}

	getPlayfield(): null | Playfield {
		return this.#playfield;
	}

	process(deltatime: number) {
		this.#playfield?.process(deltatime);
		this.#entities.forEach((entity: EntityInterface): void => entity.process(deltatime));
	}

	render() {
		this.#playfield?.render();
		this.#entities.forEach((entity: EntityInterface): void => entity.render());
	}
}

export const entityManager = new EntityManager();
