import "./global.ts";
import Playfield from "./playfield.ts";

console.log("bruh");

const playfield = new Playfield(20, 15);

function frame() {
    playfield.process(0);
    playfield.render();
}

function tick() {
    frame();
    window.requestAnimationFrame(tick);
}

window.requestAnimationFrame(tick);
