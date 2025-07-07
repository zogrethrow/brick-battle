import EntityInterface from "./entity_interface";

export default class EntityManager {
	#entities: EntityInterface[] = [];

	add(entity: EntityInterface) {
		this.#entities.push(entity);
	}

	remove(entity: EntityInterface) {
		const index = this.#entities.findIndex((existingEntity) => existingEntity === entity);
		this.#entities = this.#entities.splice(index, 1);
	}

	process(deltatime: number) {
		for (const entity of this.#entities) {
			entity.process(deltatime);
		}
	}

	render() {
		for (const entity of this.#entities) {
			entity.render();
		}
	}
}
