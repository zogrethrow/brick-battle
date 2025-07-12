import Playfield from "../playfield";
import EntityInterface from "./entity_interface";

class EntityManager {
	#entities: Set<EntityInterface> = new Set<EntityInterface>();
  #playfield: null | Playfield = null;

	add(entity: EntityInterface) {
		this.#entities.add(entity);
	}

  addPlayfield(playfield: Playfield) {
    this.#playfield = playfield;
  }

	remove(entity: EntityInterface) {
    this.#entities.delete(entity);
	}

  getEntities(): Set<EntityInterface> {
    return this.#entities;
  }

  getPlayfield(): null | Playfield {
    return this.#playfield;
  }

	process(deltatime: number) {
    this.#playfield?.process(deltatime);
		for (const entity of this.#entities) {
			entity.process(deltatime);
		}
	}

	render() {
    this.#playfield?.render();
		for (const entity of this.#entities) {
			entity.render();
		}
	}
}

export const entityManager = new EntityManager();
