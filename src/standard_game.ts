import Playfield from "./playfield";
import EntityManager from "./entity/entity_manager";
import EntityInterface from "./interfaces/entity_interface";
import Vector2 from "./vector2";
import GameInterface from "./game_interface";

export default class StandardGame implements GameInterface {
	readonly #playfield: Playfield;
	readonly #entityManager: EntityManager;
	#lastFrame: number = 0;

	constructor(playfield: Playfield, entityManager: EntityManager) {
		this.#playfield = playfield;
		this.#entityManager = entityManager;
		this.#entityManager.addPlayfield(this.#playfield);
		window.requestAnimationFrame(this.tick.bind(this));
	}

	getEntities(): EntityInterface[] {
		return this.#entityManager.getEntities();
	}

	getPlayfield(): Playfield {
		return this.#playfield;
	}

	selectEntityAtTile(position: Vector2): EntityInterface | null {
		return this.#entityManager.getEntityAtPosition(position);
	}

	addEntity(entity: EntityInterface): EntityInterface {
		this.#entityManager.add(entity);
		return entity;
	}

	removeEntity(entity: EntityInterface): void {
		this.#entityManager.remove(entity);
	}

	tick(frame: number): void {
		const deltaTime: number = frame / 1000 - this.#lastFrame;
		this.#lastFrame = frame / 1000;

		this.#playfield.process(deltaTime);
		this.#entityManager.process(deltaTime);

		window.requestAnimationFrame(this.tick.bind(this));
	}
}