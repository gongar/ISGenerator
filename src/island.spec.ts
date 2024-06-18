import { instance, mock, when } from 'ts-mockito'
import { getIslandShores } from "./island"
import data from "../test-data.json"

function setupMap(
    mockedTileMap: TileMap, mockedTileLayer: TileLayer, mockedTile: Tile,
    map: number[], height: number, width: number) {
    for (let i = 0; i <= height; i++) {
        for (let j = 0; j <= width; j++) {
            when(mockedTileMap.tileToPixel(j, i)).thenReturn({ x: j, y: i })
        }
    }

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            when(mockedTileLayer.tileAt(j, i)).thenReturn(map[i * width + j] ? instance(mockedTile) : null)
        }
    }
}

describe("Polygon Generation", () => {
    let mockedTileMap: TileMap
    let mockedTile: Tile
    let mockedTileLayer: TileLayer

    beforeEach(() => {
        mockedTileMap = mock<TileMap>()
        mockedTile = mock<Tile>()
        mockedTileLayer = mock<TileLayer>()
        when(mockedTileMap.infinite).thenReturn(false)
        when(mockedTileLayer.region()).thenReturn({
            boundingRect: { x: 0, y: 0, width: 0, height: 0 },
        } as region)
    })

    test("One island with no inner shores", () => {
        when(mockedTileLayer.width).thenReturn(data.tileWidth1)
        when(mockedTileLayer.height).thenReturn(data.tileHeight1)
        const map = instance(mockedTileMap)
        const layer = instance(mockedTileLayer)

        setupMap(mockedTileMap, mockedTileLayer, mockedTile, data.map1, data.tileHeight1, data.tileWidth1)

        const polygons = getIslandShores(layer, map)
        data.polygons1[0].forEach(p => {
            expect(polygons[0]).toContainEqual<point>(p)
        })
        polygons[0].forEach(p => {
            expect(data.polygons1[0]).toContainEqual<point>(p)
        })
    })

    test("One tile island - 3x3 center", () => {
        when(mockedTileLayer.width).thenReturn(data.tileWidth2)
        when(mockedTileLayer.height).thenReturn(data.tileHeight2)
        const map = instance(mockedTileMap)
        const layer = instance(mockedTileLayer)

        setupMap(mockedTileMap, mockedTileLayer, mockedTile, data.map2, data.tileHeight2, data.tileWidth2)

        const polygons = getIslandShores(layer, map)
        expect(polygons).toContainEqual<Polygon>(data.polygons2[0])
    })

    test("One tile island - 3x3 top left", () => {
        when(mockedTileLayer.width).thenReturn(data.tileWidth3)
        when(mockedTileLayer.height).thenReturn(data.tileHeight3)
        const map = instance(mockedTileMap)
        const layer = instance(mockedTileLayer)

        setupMap(mockedTileMap, mockedTileLayer, mockedTile, data.map3, data.tileHeight3, data.tileWidth3)

        const polygons = getIslandShores(layer, map)
        expect(polygons).toContainEqual<Polygon>(data.polygons3[0])
    })

    test("One tile island - 6x5 bottom left", () => {
        when(mockedTileLayer.width).thenReturn(data.tileWidth4)
        when(mockedTileLayer.height).thenReturn(data.tileHeight4)
        const map = instance(mockedTileMap)
        const layer = instance(mockedTileLayer)

        setupMap(mockedTileMap, mockedTileLayer, mockedTile, data.map4, data.tileHeight4, data.tileWidth4)

        const polygons = getIslandShores(layer, map)
        expect(polygons).toContainEqual<Polygon>(data.polygons4[0])
    })

    test("One tile height island - 5x5 center", () => {
        when(mockedTileLayer.width).thenReturn(data.tileWidth5)
        when(mockedTileLayer.height).thenReturn(data.tileHeight5)
        const map = instance(mockedTileMap)
        const layer = instance(mockedTileLayer)

        setupMap(mockedTileMap, mockedTileLayer, mockedTile, data.map5, data.tileHeight5, data.tileWidth5)

        const polygons = getIslandShores(layer, map)
        expect(polygons).toContainEqual<Polygon>(data.polygons5[0])
    })

    test("Two islands - 4x4 center", () => {
        when(mockedTileLayer.width).thenReturn(data.tileWidth6)
        when(mockedTileLayer.height).thenReturn(data.tileHeight6)
        const map = instance(mockedTileMap)
        const layer = instance(mockedTileLayer)

        setupMap(mockedTileMap, mockedTileLayer, mockedTile, data.map6, data.tileHeight6, data.tileWidth6)

        const polygons = getIslandShores(layer, map)
        expect(polygons).toContainEqual<Polygon>(data.polygons6[0])
        expect(polygons).toContainEqual<Polygon>(data.polygons6[1])
    })

    test("Whole area island - 2x2", () => {
        when(mockedTileLayer.width).thenReturn(data.tileWidth7)
        when(mockedTileLayer.height).thenReturn(data.tileHeight7)
        const map = instance(mockedTileMap)
        const layer = instance(mockedTileLayer)

        setupMap(mockedTileMap, mockedTileLayer, mockedTile, data.map7, data.tileHeight7, data.tileWidth7)

        const polygons = getIslandShores(layer, map)
        expect(polygons).toContainEqual<Polygon>(data.polygons7[0])
    })

    test("Island with two lakes - 9x9", () => {
        when(mockedTileLayer.width).thenReturn(data.tileWidth8)
        when(mockedTileLayer.height).thenReturn(data.tileHeight8)
        const map = instance(mockedTileMap)
        const layer = instance(mockedTileLayer)

        setupMap(mockedTileMap, mockedTileLayer, mockedTile, data.map8, data.tileHeight8, data.tileWidth8)

        const polygons = getIslandShores(layer, map)
        expect(polygons).toContainEqual<Polygon>(data.polygons8[0])
        expect(polygons).toContainEqual<Polygon>(data.polygons8[1])
        expect(polygons).toContainEqual<Polygon>(data.polygons8[2])
    })
})