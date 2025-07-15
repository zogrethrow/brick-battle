import Vector2 from "../vector2";

export default interface EntityInterface {
	position: Vector2;
	process(deltatime: number): void;
	render(): void;
}
