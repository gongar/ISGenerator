const { defineConfig } = require("tsup")
const path = require("node:path")

module.exports = defineConfig({
    entry: {
        poly: "./src/index.ts"
    },
    bundle: true,
    platform: "browser",
    format: ["iife"],
    outDir: path.resolve(__dirname, "dist")
})