import EntityInterface from "./abstract_entity";

export default class EntityManager {
  #entities: EntityInterface[] = [];

  add(entity: EntityInterface) {
    this.#entities.push(entity);
  }

  remove(entity: EntityInterface) {
    this.#entities.splice(this.#entities[entity], 1);
  }

  process(deltatime: number) {
    for (const entity of this.#entities) {
      entity.process(deltatime);
    }
  }

  render() {
    for (const entity of this.#entities) {
      entity.process();
    }
  }
}
