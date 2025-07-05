import "./global.ts";
import Playfield from "./playfield.ts";
import * as Mouse from "./input/mouse";

console.log("bruh");

const playfield = new Playfield(20, 15);

function frame() {
    Mouse.update();
    console.log(`held: ${Mouse.left.held}, pressed: ${Mouse.left.pressed}, released: ${Mouse.left.released}`);
    playfield.process(0);
    playfield.render();
}

function tick() {
    frame();
    window.requestAnimationFrame(tick);
}

window.requestAnimationFrame(tick);
