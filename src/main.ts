import Playfield from "./playfield";
import * as Mouse from "./input/mouse";
import * as Keyboard from "./input/keyboard";
import EntityManager from "./entity/entity_manager";
import { ctx } from "./global";
import Unit from "./entity/unit";
import Vector2 from "./vector2";
import Pathfinding from "./pathfinding";

let lastFrame = 0;
const entityManager = new EntityManager();

const playfield = new Playfield(20, 15);
playfield.loadState();
entityManager.add(playfield);

const pathfinding = new Pathfinding(playfield);
entityManager.add(pathfinding);

const unit = new Unit(new Vector2(200, 200));
entityManager.add(unit);

function tick(frame: number) {
    const deltatime = (frame / 1000) - lastFrame;
    lastFrame = (frame / 1000);

    Mouse.update();
    Keyboard.update();

    entityManager.process(deltatime);

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    entityManager.render();
    window.requestAnimationFrame(tick);
}

window.requestAnimationFrame(tick);
