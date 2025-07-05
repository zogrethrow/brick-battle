export const canvas = document.createElement("canvas");
canvas.width = 640;
canvas.height = 480;
const context = canvas.getContext("2d");
if (!context) throw new Error("CanvasRenderingContext2D not available!");

document.body.appendChild(canvas);

export const ctx = context;
