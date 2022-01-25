import { flatc } from "../dist/browser.flatbuffers.js";
import WasmFs from "./wasmfs.esm.js";

const { fs } = new WasmFs();
globalThis.fs = fs;

let fb = new flatc({
    fs: fs,
    rootDir: "/"
});

globalThis.errPipe = fs.createReadStream("/dev/stderr");
globalThis.outPipe = fs.createReadStream("/dev/stdout");
globalThis.errPipe.on("data", data => {
    postMessage({ error: data.toString("utf8") });
});
globalThis.outPipe.on("data", data => {
    postMessage({ out: data.toString("utf8") });
});

globalThis.onmessage = async (msg) => {
    let { idl } = msg.data;

    postMessage(idl);

    fs.mkdirpSync('/output');
    let outFile = "/output/monster.fbs";
    try {
        fs.writeFileSync(outFile, idl);

        await fb.runCommand(["./flatc", "--ts", "-o", "/test", outFile]);

        postMessage(fs.readFileSync(outFile, { encoding: 'utf8' }));
    } catch (e) {
        postMessage({ error: e.message });
    }
}


