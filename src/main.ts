import Playfield from "./playfield";
import * as Mouse from "./input/mouse";
import EntityManager from "./entity/entity_manager";
import { ctx } from "./global";
import Unit from "./entity/unit";
import Vector2 from "./vector2";

let lastFrame = 0;
const entityManager = new EntityManager();

const playfield = new Playfield(20, 15);
playfield.loadState();
entityManager.add(playfield);

const unit = new Unit(new Vector2(200, 200));
entityManager.add(unit);

unit.move(new Vector2(400, 400));

function tick(frame: number) {
    const deltatime = (frame / 1000) - lastFrame;
    lastFrame = (frame / 1000);

    Mouse.update();

    entityManager.process(deltatime);

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    entityManager.render();
    window.requestAnimationFrame(tick);
}

window.requestAnimationFrame(tick);
