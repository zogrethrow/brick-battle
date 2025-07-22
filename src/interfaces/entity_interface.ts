import Vector2 from "../vector2.ts";

export default interface EntityInterface {
	id: string;
	position: Vector2;
	process(deltatime: number): void;
}
