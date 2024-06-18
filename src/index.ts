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

    if (map.orientation == TileMap.Staggered || map.orientation == TileMap.Hexagonal) {
        tiled.alert("Staggered and hexagonal are not currently supported")
        return
    }

    try {
        const islands = getIslandShores(layer as TileLayer, map)
        const newObjectLayer = new ObjectGroup()
        newObjectLayer.offset.x = layer.offset.x
        newObjectLayer.offset.y = layer.offset.y
        newObjectLayer.name = `Island Shores (${layer.name})`

        for (let island of islands) {
            const newMapObject = new MapObject()
            newMapObject.polygon = island
            newMapObject.shape = MapObject.Polygon
            newObjectLayer.addObject(newMapObject)
        }
        map.addLayer(newObjectLayer)
    } catch (e) {
        tiled.error(`${e}`, () => {})
    }
});

action.text = "Create Island Shores"
action.iconVisibleInMenu = false

tiled.extendMenu("LayerView.Layers", [
    { action: "IslandShores", before: "LayerProperties" },
    { separator: true }
]);