export default class Vector2 {
	constructor(
		public x: number,
		public y: number,
	) {}

	/**
	 * Get the length of the vector
	 */
	get length(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	/**
	 * Get angle of vector in radians
	 */
	get angle(): number {
		return Math.atan2(this.x, this.y);
	}

	/**
	 * Create a new vector of length 1, pointing in the given direction
	 */
	static fromAngle(angle: number): Vector2 {
		return new Vector2(Math.cos(angle), Math.sin(angle));
	}

	directonTo(other: Vector2): number {
		return Math.atan2(other.x - this.x, other.y - this.y);
	}

	add(other: Vector2): Vector2 {
		return new Vector2(this.x + other.x, this.y + other.y);
	}

	sub(other: Vector2): Vector2 {
		return new Vector2(this.x - other.x, this.y - other.y);
	}

	mul(scalar: number): Vector2 {
		return new Vector2(this.x * scalar, this.y * scalar);
	}

	div(scalar: number): Vector2 {
		return new Vector2(this.x / scalar, this.y / scalar);
	}

	normalize(): Vector2 {
		const length = this.length;
		return new Vector2(this.x / length, this.y / length);
	}
}
