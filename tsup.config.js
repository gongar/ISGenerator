const { defineConfig } = require("tsup")
const path = require("node:path")

module.exports = defineConfig({
    entry: ["./src/index.ts"],
    bundle: true,
    platform: "browser",
    format: ["iife"],
    outExtension: () => {
        return {
            js: '.js'
        }
    },
    esbuildOptions: (option) => {
        option.entryNames = "[dir]/IslandShores"
    },
    outDir: path.resolve(__dirname, "dist")
})