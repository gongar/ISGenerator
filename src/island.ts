export interface Island {
    poligon: Polygon
    isInner: boolean
}

export function getIslandShores(layer: TileLayer): Island[] {
    const width = layer.width;
    const height = layer.height;
    const tileMap: boolean[] = [];
    const islandMap: number[] = [];

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const tile = layer.tileAt(j, i);
            tileMap[i * width + j] = !!tile
            islandMap[i * width + j] = 0
        }
    }

    return [] as Island[]
}

function classifyIslands(tileMap: boolean[], islandMap: number[], height: number, width: number) {
    let islandId = 1

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (tileMap[i * width + j] && islandMap[i * width + j] == 0) {
                floodFill(tileMap, islandMap, i, j, islandId)
                islandId++
            }
        }
    }
}

function floodFill(tileMap: boolean[], islandMap: number[], i: number, j: number, islandId: number) {
    const stack: Record<string, number>[] = [];

    stack.push({first: i, second: j})

    while(stack.length > 0) {

    }
}