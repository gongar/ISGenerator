import { instance, mock, when } from 'ts-mockito'
import { getIslandShores } from "./island"

const tileMap1 = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
    0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
    0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0,
    0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0,
    0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
] as const

const polygons1 = [
    [
        {
            x: 6,
            y: 4,
        },
        {
            x: 1,
            y: 4,
        },
        {
            x: 1,
            y: 6,
        },
        {
            x: 2,
            y: 6,
        },
        {
            x: 2,
            y: 7,
        },
        {
            x: 1,
            y: 7,
        },
        {
            x: 1,
            y: 9,
        },
        {
            x: 3,
            y: 9,
        },
        {
            x: 3,
            y: 12,
        },
        {
            x: 7,
            y: 12,
        },
        {
            x: 7,
            y: 9,
        },
        {
            x: 10,
            y: 9,
        },
        {
            x: 10,
            y: 11,
        },
        {
            x: 13,
            y: 11,
        },
        {
            x: 13,
            y: 9,
        },
        {
            x: 16,
            y: 9,
        },
        {
            x: 16,
            y: 4,
        },
        {
            x: 14,
            y: 4,
        },
        {
            x: 14,
            y: 5,
        },
        {
            x: 9,
            y: 5,
        },
        {
            x: 9,
            y: 2,
        },
        {
            x: 7,
            y: 2,
        },
    ]
];

const tileWidth = 18
const tileHeight = 14

describe("Polygon Generation", () => {
    test("One island without any inner shores", () => {
        const mockedTileMap = mock<TileMap>()
        const mockedTile = mock<Tile>()
        const map = instance(mockedTileMap)
        const mockedTileLayer = mock<TileLayer>()
        const layer = instance(mockedTileLayer)
        const mockedRegion = mock<region>()
        const regionInstance = instance(mockedRegion)

        when(mockedTileLayer.width).thenReturn(tileWidth)
        when(mockedTileLayer.height).thenReturn(tileHeight)
        when(mockedTileLayer.region()).thenReturn(regionInstance)

        for (let i = 0; i <= tileHeight; i++) {
            for (let j = 0; j <= tileWidth; j++) {
                when(mockedTileMap.tileToPixel(j, i)).thenReturn({ x: j, y: i })
            }
        }

        for (let i = 0; i < tileHeight; i++) {
            for (let j = 0; j < tileWidth; j++) {
                when(mockedTileLayer.tileAt(j, i)).thenReturn(tileMap1[i * tileWidth + j] ? instance(mockedTile) : null)
            }
        }

        const polygons = getIslandShores(layer, map)

        expect(polygons).toContainEqual<Polygon>(polygons1[0])
    })
})