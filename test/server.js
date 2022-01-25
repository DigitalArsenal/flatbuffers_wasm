import express from 'express';
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
/*eslint-env node*/
import serveIndex from "serve-index";
const app = express();
const port = 3000;
const spath = process.cwd();
var mime = express.static.mime;
mime.define(
    {
        "application/json": ["czml", "json", "geojson", "topojson"],
        "application/wasm": ["wasm"],
        "image/crn": ["crn"],
        "image/ktx": ["ktx"],
        "model/gltf+json": ["gltf"],
        "model/gltf-binary": ["bgltf", "glb"],
        "application/octet-stream": [
            "b3dm",
            "pnts",
            "i3dm",
            "cmpt",
            "geom",
            "vctr"
        ],
        "text/plain": ["glsl"]
    },
    true
);
app.use(express.static(spath), serveIndex(spath));
app.listen(port, () => {
    console.log('Server listening on port: ', port);
    console.log('Serving files from: ', spath);
});