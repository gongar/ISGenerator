interface Pair {
    x: number
    y: number
}

const directions = ['n', 'e', 's', 'w'] as const
const steps = {
    n: { x: 0, y: 1 },
    e: { x: 1, y: 0 },
    s: { x: 0, y: -1 },
    w: { x: -1, y: 0 }
} as const

interface Vertex {
    x: number
    y: number
    dir: keyof typeof steps | null
}

export function getIslandShores(layer: TileLayer, map: TileMap): Polygon[] {
    const width = layer.width
    const height = layer.height
    const tileMap: boolean[] = []
    const islandMap: number[] = []
    const neighbors: (number)[] = []

    initTileMap({ tileMap, layer, width, height })
    countNeighbors({ tileMap, neighbors, width, height })
    let islandIds = classifyIslands({ tileMap, islandMap, height, width })

    let shores: Polygon[] = []
    for (let islandId of islandIds) {
        shores.push(createIslandShore({ neighbors, height, width, islandId, islandMap, map }))
    }

    return shores
}

function initTileMap(o: { tileMap: boolean[], layer: TileLayer, height: number, width: number, }) {
    const { tileMap, height, width, layer } = o
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const tile = layer.tileAt(j, i)
            tileMap[i * width + j] = !!tile
        }
    }
}

/**
 * It creates a polygon that exactly fits the areas that are continuously tiled.
 */
function createIslandShore(
    o: {
        islandMap: number[],
        neighbors: number[], height: number, width: number,
        islandId: number, map: TileMap
    }): Polygon {
    const { islandMap, neighbors, height, width, islandId, map } = o
    const poligon: Pair[] = []


    const start = findStartVertex({
        neighbors, islandMap, height, width, islandId
    })
    if (!start) {
        throw Error("No tile found")
    }

    const current: Vertex = { x: start.x, y: start.y, dir: null }
    const stack: Vertex[] = []
    const visited = new Set([start.y * (width + 1) + start.x]);

    do {
        stack.push({ x: current.x, y: current.y, dir: current.dir })

        let found = false
        for (let dir of directions) {
            const x = current.x + steps[dir].x
            const y = current.y + steps[dir].y
            const c = neighbors[y * (width + 1) + x]
            if (x >= 0 && x <= width && y >= 0 && y <= height && c > 0 && c < 4 && !visited.has(y * (width + 1) + x)) {
                visited.add(y * (width + 1) + x)
                current.x = x
                current.y = y
                current.dir = dir
                found = true
                break
            }
        }

        if (!found) {
            break
        }
    } while (current.x != start.x || current.y != start.y)

    let p: any
    while (stack.length > 0) {
        const c = stack.pop()!
        if (p != c.dir && p !== undefined) {
            poligon.push(map.tileToPixel(c.x, c.y))
        }
        p = c.dir
    }

    return poligon
}

function findStartVertex(o: {
    neighbors: number[], islandMap: number[],
    height: number, width: number, islandId: number
}): Pair | null {
    const { islandMap, neighbors, height, width, islandId } = o

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (islandMap[i * width + j] != islandId) {
                continue;
            }

            for (let dir of directions) {
                const c = neighbors[(i + steps[dir].y) * width + j + steps[dir].x]
                if (c < 4 && c > 0) {
                    return { x: j, y: i }
                }
            }
        }
    }

    return null;
}

/** 
 * It counts neighbor tiles for every tile's vertex
 */
function countNeighbors(
    o: {
        tileMap: boolean[], neighbors: number[],
        height: number, width: number
    }) {
    const { tileMap, neighbors, height, width } = o

    for (let i = 0; i <= height; i++) {
        for (let j = 0; j <= width; j++) {
            neighbors[i * (width + 1) + j] = 0
        }
    }

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (tileMap[i * width + j]) {
                neighbors[i * (width + 1) + j]++
                neighbors[(i + 1) * (width + 1) + j]++
                neighbors[i * (width + 1) + j + 1]++
                neighbors[(i + 1) * (width + 1) + j + 1]++
            }
        }
    }
}

/**
 * It fills the islandMap with numbers which represent island ids
 * It gives us to know which tile at the point (i,j) belongs to which island
 */
function classifyIslands(
    o: {
        tileMap: boolean[], islandMap: number[],
        height: number, width: number
    }): number[] {
    const { islandMap, tileMap, height, width } = o
    let islands: number[] = []
    let islandId = 1

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            islandMap[i * width + 1 + j] = 0
        }
    }

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (tileMap[i * width + j] && islandMap[i * width + j] == 0) {
                floodFill({
                    tileMap: tileMap, islandMap: islandMap, i, j,
                    width: width, height: height, islandId
                })
                islands.push(islandId)
                islandId++
            }
        }
    }

    return islands
}

/**
 *  This is Flood Fill algorithm, which fills adjacent tiles with the same islandId value
 */
function floodFill(
    o: {
        tileMap: boolean[], islandMap: number[], i: number, j: number,
        height: number, width: number, islandId: number
    }) {
    const { islandMap, tileMap, height, width, islandId, i, j } = o
    const stack: Pair[] = []

    stack.push({ x: j, y: i })

    while (stack.length > 0) {
        const pair = stack.pop()!

        if (
            pair.x < 0
            || pair.x >= width
            || pair.y < 0
            || pair.y >= height
            || !tileMap[pair.y * width + pair.x]
            || islandMap[pair.y * width + pair.x] != 0) {
            continue
        }

        islandMap[pair.y * width + pair.x] = islandId


        stack.push({ x: pair.x + 1, y: pair.y })
        stack.push({ x: pair.x - 1, y: pair.y })
        stack.push({ x: pair.x, y: pair.y + 1 })
        stack.push({ x: pair.x, y: pair.y - 1 })
    }
}