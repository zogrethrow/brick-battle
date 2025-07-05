import Playfield from "./playfield";
import * as Mouse from "./input/mouse";
import EntityManager from "./entity/entity_manager";
import { ctx } from "./global";

const entityManager = new EntityManager();

const playfield = new Playfield(20, 15);
playfield.loadState();
entityManager.add(playfield);

function frame() {
    Mouse.update();
    
    entityManager.process(0);

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    entityManager.render();
}

function tick() {
    frame();
    window.requestAnimationFrame(tick);
}

window.requestAnimationFrame(tick);
