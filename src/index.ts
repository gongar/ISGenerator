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

    const islands = getIslandShores(layer as TileLayer)

    const newObjectLayer = new ObjectGroup()
    newObjectLayer.name = "Island Shores"

    for (let island of islands) {
        const newMapObject = new MapObject()
        newMapObject.polygon = island.poligon
        newObjectLayer.addObject(newMapObject)
    }
});

action.text = "Generate Island Shores"

tiled.extendMenu("LayerView.Layers", [
    { action: "IslandShores", before: "LayerProperties" },
    { separator: true }
]);