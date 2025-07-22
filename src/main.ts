import Playfield from "./playfield";
import EntityManager from "./entity/entity_manager";
import Resource from "./entity/resource";
import StandardGame from "./standard_game";
import Vector2 from "./vector2";
import * as Mouse from "./input/mouse";
import * as Keyboard from "./input/keyboard";
import { Renderer, GRID_SIZE } from "./renderer";
import Unit from "./entity/unit.ts";

const playfield = new Playfield(20, 15);
const entityManager = new EntityManager();
const game = new StandardGame(playfield, entityManager);
const renderer = new Renderer(game);

const unit = new Unit(
	new Vector2(Math.floor(200 / GRID_SIZE), Math.floor(200 / GRID_SIZE)),
	1,
);
game.addEntity(unit);

let selectedUnit: Unit | null = null;

function tick(frame: number): void {
	game.tick(frame);

	Mouse.update();
	Keyboard.update();

	const mousePos = new Vector2(Math.floor(Mouse.position.x / GRID_SIZE), Math.floor(Mouse.position.y / GRID_SIZE));

	if (Mouse.left.pressed) {
		const entity = game.selectEntityAtTile(mousePos);
		if (entity && (entity as any).setTarget) {
			selectedUnit = entity as Unit;
			renderer.setSelectedEntity(entity.id);
		} else if (selectedUnit && game.getPlayfield().isTilePassable(mousePos)) {
			if (Keyboard.checkHeld("SHIFT")) {
				selectedUnit.addTarget(mousePos);
			} else {
				selectedUnit.setTarget(mousePos);
			}
		}
	}

	if (Mouse.right.pressed && selectedUnit && game.getPlayfield().isTilePassable(mousePos)) {
		selectedUnit.prependTarget(mousePos);
	}

	renderer.render();
	window.requestAnimationFrame(tick);
}

window.requestAnimationFrame(tick);