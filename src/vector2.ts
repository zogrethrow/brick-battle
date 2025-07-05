export default class Vector2 {
    constructor(
        public x: number,
        public y: number,
    ) {
    }

    /**
     * Get the length of the vector
     */
    get length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    directonTo(other: Vector2): number {
        return Math.atan2(
            other.x - this.x,
            other.y - this.y,
        );
    }

    add(other: Vector2): Vector2 {
        return new Vector2(
            this.x + other.x,
            this.y + other.y,
        );
    }

    sub(other: Vector2): Vector2 {
        return new Vector2(
            this.x - other.x,
            this.y - other.y,
        );
    }

    normalize(): Vector2 {
        const length = this.length;
        return new Vector2(
            this.x / length,
            this.y / length,
        );
    }
}
