import { getIslandShores } from "./island"

const action = tiled.registerAction("IslandShores", function() {
    if (!tiled.activeAsset || !tiled.activeAsset.isTileMap) {
        return;
    }

    const map = tiled.activeAsset as TileMap
    const layer = map.currentLayer;

    if (!layer || !layer.isTileLayer) {
        return;
    }

    if (map.orientation == TileMap.Staggered || map.orientation == TileMap.Hexagonal || map.infinite) {
        tiled.alert("Warning!", "Staggered, hexagonal and infinite maps are not currently supported")
        return
    }

    try {
        const islands = getIslandShores(layer as TileLayer, map)

        const newObjectLayer = new ObjectGroup()
        newObjectLayer.name = `Island Shores (${layer.name})`

        for (let island of islands) {
            const newMapObject = new MapObject()
            newMapObject.polygon = island
            newMapObject.shape = MapObject.Polygon
            newMapObject.pos.x = map.orientation == TileMap.Isometric ? -map.tileWidth / 2 : 0
            newMapObject.pos.y = map.orientation == TileMap.Isometric ? -map.tileHeight : 0
            newMapObject.height = map.height * map.tileHeight / 2
            newMapObject.width = map.width * map.tileWidth
            newObjectLayer.addObject(newMapObject)
        }
        map.addLayer(newObjectLayer)
    } catch (e) {
        tiled.error(`${e}`, () => {})
    }
});

action.text = "Generate Island Shores"

tiled.extendMenu("LayerView.Layers", [
    { action: "IslandShores", before: "LayerProperties" },
    { separator: true }
]);