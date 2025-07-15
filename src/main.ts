import Playfield, { GRID_SIZE } from "./playfield";
import * as Mouse from "./input/mouse";
import * as Keyboard from "./input/keyboard";
import { entityManager } from "./entity/entity_manager";
import { ctx } from "./global";
import Unit from "./entity/unit";
import Vector2 from "./vector2";
import Resource from "./entity/resource";

let lastFrame = 0;

const playfield = new Playfield(20, 15);
playfield.loadState();
entityManager.addPlayfield(playfield);

const resource = new Resource(
	new Vector2((400 / GRID_SIZE) * GRID_SIZE + GRID_SIZE * 0.5, (400 / GRID_SIZE) * GRID_SIZE + GRID_SIZE * 0.5),
);
entityManager.add(resource);

const unit = new Unit(
	new Vector2((200 / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2, (200 / GRID_SIZE) * GRID_SIZE + GRID_SIZE * 0.5),
	1,
);
entityManager.add(unit);

function tick(frame: number) {
	const deltatime = frame / 1000 - lastFrame;
	lastFrame = frame / 1000;

	Mouse.update();
	Keyboard.update();

	if (Mouse.left.pressed) {
		const x = Math.floor(Mouse.position.x / GRID_SIZE) * GRID_SIZE + GRID_SIZE * 0.5;
		const y = Math.floor(Mouse.position.y / GRID_SIZE) * GRID_SIZE + GRID_SIZE * 0.5;
		if (Keyboard.checkHeld("SHIFT")) {
			unit.addTarget(new Vector2(x, y));
		} else {
			unit.setTarget(new Vector2(x, y));
		}
	}

	if (Mouse.right.pressed) {
		const x = Math.floor(Mouse.position.x / GRID_SIZE) * GRID_SIZE + GRID_SIZE * 0.5;
		const y = Math.floor(Mouse.position.y / GRID_SIZE) * GRID_SIZE + GRID_SIZE * 0.5;
		unit.prependTarget(new Vector2(x, y));
	}

	entityManager.process(deltatime);

	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	entityManager.render();

	// Raycast test
	// ctx.moveTo(unit.position.x, unit.position.y);
	// ctx.lineTo(Mouse.position.x, Mouse.position.y);
	// const raycast = playfield.lineIntersection(unit.position, Mouse.position);
	// ctx.strokeStyle = raycast === null ? "yellow" : "red";
	// ctx.stroke();
	// if (raycast) {
	// 	ctx.moveTo(raycast.x, raycast.y);
	// 	ctx.fillStyle = ctx.strokeStyle;
	// 	ctx.arc(raycast.x, raycast.y, 3, 0, Math.PI * 2);
	// 	ctx.fill();
	// }

	window.requestAnimationFrame(tick);
}

window.requestAnimationFrame(tick);
