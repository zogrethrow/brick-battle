import Vector2 from "../vector2";
import { canvas } from "../global";
import ButtonState from "./button_state";

/**
 * Position of the mouse cursor.
 */
export let position: Vector2 = new Vector2(0, 0);

/**
 * State for all mouse buttons.
 */
export const buttons: ButtonState[] = new Array(8);
for (let i = 0; i < 8; i++) {
    buttons[i] = new ButtonState();
}

/**
 * State for the left mouse button.
 */
export const left = buttons[0];

/**
 * State for the right mouse button.
 */
export const right = buttons[2];

/**
 * State for the middle mouse button.
 */
export const middle = buttons[1];

// Add mouse position listeners
canvas.addEventListener("mousemove", (event) => {
    position.x = event.offsetX;
    position.y = event.offsetY;
});
canvas.addEventListener("mousemove", (event) => {
    position.x = event.offsetX;
    position.y = event.offsetY;
});

// Add mouse click/release listeners
canvas.addEventListener("mousedown", (event) => {
    buttons[event.button].next = true;
});
canvas.addEventListener("mouseup", (event) => {
    buttons[event.button].next = false;
});

// Ignore these events
for (const eventName of ["contextmenu", "drag", "dragstart"]) {
    canvas.addEventListener(eventName, (event) => {
        event.preventDefault();
    });
}

/**
 * Updates the pressed/released state of buttons.
 * Has to be called once every frame.
 */
export function update() {
    for (const button of buttons) {
        button.update();
    }
}
