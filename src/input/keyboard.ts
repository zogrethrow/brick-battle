import ButtonState from "./button_state";

/**
 * Contains the state of all recently used keys.
 */
const keyStates: {[k: string]: ButtonState} = {};

/**
 * Gets (or creates) a key state for the given string.
 */
function getOrCreateKey(key: string): ButtonState {
    let keyState = keyStates[key];
    if (keyState) return keyState;

    // Create state for this key
    keyState = new ButtonState();
    keyStates[key] = keyState;
    return keyState;
}

function updateKeyState(event: KeyboardEvent, value: boolean) {
    // Get key, uppercase it is it's just one letter
    let key = event.key.toUpperCase();

    // Update key state
    const state = getOrCreateKey(key);
    state.next = value;
}

// Add event listeners
document.addEventListener("keydown", (event) => {
    updateKeyState(event, true);
});
document.addEventListener("keyup", (event) => {
    updateKeyState(event, false);
});

// Drop all keyboard events if the window loses focus
window.addEventListener("blur", () => {
    for (const key in keyStates) {
        const state = keyStates[key];
        state.next = false;
    }
});

/**
 * Check if key is held
 */
export function checkHeld(key: string): boolean {
    const keyState = keyStates[key.toUpperCase()];
    if (!keyState) return false;

    return keyState.held;
}

/**
 * Check if key was just pressed this frame
 */
export function checkPressed(key: string): boolean {
    const keyState = keyStates[key.toUpperCase()];
    if (!keyState) return false;

    return keyState.pressed;
}

/**
 * Check if key was just released this frame
 */
export function checkReleased(key: string): boolean {
    const keyState = keyStates[key.toUpperCase()];
    if (!keyState) return false;

    return keyState.released;
}

/**
 * Call this once every frame to update keyboard state
 */
export function update() {
    const toDelete: string[] = [];
    
    for (const key in keyStates) {
        const state = keyStates[key];
        state.update();

        if (!state.held && !state.released) {
            toDelete.push(key);
        }
    }

    // Remove these
    for (const key of toDelete) {
        delete keyStates[key];
    }
}
