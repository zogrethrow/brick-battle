export default interface EntityInterface {
  process(deltatime: number): void;
  render(): void;
}
