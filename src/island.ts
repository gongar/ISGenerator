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
        shores.push(createIslandShore({ tileMap, neighbors, height, width, islandId, islandMap, map }))
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
        tileMap: boolean[], islandMap: number[],
        neighbors: number[], height: number, width: number,
        islandId: number, map: TileMap
    }): Polygon {
    const { tileMap, islandMap, neighbors, height, width, islandId, map } = o

    const start = findStartVertex({
        neighbors, islandMap, height, width, islandId
    })
    if (!start) {
        throw Error("Unknown Error")
    }

    let { x, y } = start
    const visited = new Set([y * (width + 1) + x])
    const polygon: point[] = []

    do {
        polygon.push({ x, y })

        let found = false
        for (let d of directions) {
            const new_x = x + steps[d].x
            const new_y = y + steps[d].y
            const c = neighbors[new_y * (width + 1) + new_x]
            if (
                new_x >= 0 && new_x <= width && new_y >= 0 && new_y <= height
                && c > 0 && c < 4 && !visited.has(new_y * (width + 1) + new_x)
                && isAdjacent({x, y}, {x: new_x, y: new_y}, {tileMap, width})) {
                x = new_x
                y = new_y
                visited.add(y * (width + 1) + x)
                found = true
                break
            }
        }

        if (!found) {
            break
        }
    } while (x != start.x || y != start.y)

    return simplifyVertices(polygon).map(p => map.tileToPixel(p.x, p.y))
}

function isAdjacent(a: point, b: point, o: {tileMap: boolean[], width: number}):  boolean {
    const { tileMap, width } = o

    if (Math.abs(a.x - b.x) > 1 || Math.abs(a.y - b.y) > 1) return false

    if (a.x == b.x) {
        const c = a.y > b.y ? b : a
        return tileMap[c.y * width + c.x] || tileMap[c.y * width + c.x - 1]
    } else if (a.y == b.y) {
        const c = a.x > b.x ? b : a
        return tileMap[c.y * width + c.x] || tileMap[(c.y - 1) * width + c.x]
    }

    return false
}

// It removes the extra vertices but keeps the same shape
function simplifyVertices(polygon: point[]): point[] {
    let simplified: point[] = []
    let size = polygon.length
    let last = polygon[size - 1]
    let first = polygon[0]

    for (let i = 0; i < size; i++) {
        let prev = polygon[i - 1] || last
        let curr = polygon[i]
        let next = polygon[i + 1] || first

        if ((prev.x == curr.x && curr.x == next.x) || (prev.y == curr.y && curr.y == next.y)) {
            continue
        }
        simplified.push(curr)
    }

    return simplified
}

function findStartVertex(o: {
    neighbors: number[], islandMap: number[],
    height: number, width: number, islandId: number
}): Pair | null {
    const { islandMap, neighbors, height, width, islandId } = o

    for (let i = 0; i <= height; i++) {
        for (let j = 0; j <= width; j++) {
            const c = neighbors[i * (width + 1) + j]
            if (c >= 4 || c < 0) {
                continue
            }

            if (islandMap[(i % width) * width + (j % width)] == islandId) {
                return { x: j, y: i }
            }
        }
    }

    return null;
}

/** 
 * It counts the neighboring tiles for each vertex of each tile.
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
            islandMap[i * width + j] = 0
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