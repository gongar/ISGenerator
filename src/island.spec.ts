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
    })

    test("One island with no inner shores", () => {
        when(mockedTileLayer.width).thenReturn(data.tileWidth1)
        when(mockedTileLayer.height).thenReturn(data.tileHeight1)
        const map = instance(mockedTileMap)
        const layer = instance(mockedTileLayer)

        setupMap(mockedTileMap, mockedTileLayer, mockedTile, data.map1, data.tileHeight1, data.tileWidth1)

        const polygons = getIslandShores(layer, map)
        expect(polygons).toContainEqual<Polygon>(data.polygons1[0])
    })

    test("One tile island", () => {
        when(mockedTileLayer.width).thenReturn(data.tileWidth2)
        when(mockedTileLayer.height).thenReturn(data.tileHeight2)
        const map = instance(mockedTileMap)
        const layer = instance(mockedTileLayer)

        setupMap(mockedTileMap, mockedTileLayer, mockedTile, data.map2, data.tileHeight2, data.tileWidth2)

        const polygons = getIslandShores(layer, map)
        expect(polygons).toContainEqual<Polygon>(data.polygons2[0])
    })
})