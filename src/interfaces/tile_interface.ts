export enum TerrainType {
	ROCK,
	GRASS,
	WATER,
	MOUNTAIN,
	TREE,
}

export default interface TileInterface {
	terrain: TerrainType;
}
