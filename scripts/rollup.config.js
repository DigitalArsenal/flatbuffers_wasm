import brotli from "rollup-plugin-brotli";
import builtins from "rollup-plugin-node-builtins";
import commonjs from "rollup-plugin-commonjs";
import fs from "fs";
import resolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import url from "rollup-plugin-url";

let flatcwasmb64 = fs.readFileSync("./src/flatc.wasm").toString("base64");
let flathashwasmb64 = fs.readFileSync("./src/flathash.wasm").toString("base64");

fs.writeFileSync("./dist/flatc.b64.wasm", flatcwasmb64);
fs.writeFileSync("./dist/flathash.b64.wasm", flathashwasmb64);

let replacr = (line, replacement, debug) => {
  return {
    transform(code, id) {
      code = code.replace(line, replacement);

      return { code };
    }
  };
};

const plugins = [
  replacr(/const wasmBinary [^;]{1,};/, ``),
  replacr(
    /const flatcWasmPath[^;]{1,};/,
    `
  const flatcWasmPath = null; 
  let wasmBinary;
  let flatcwasmb64 = "${flatcwasmb64}";
  if(isNode){
    wasmBinary = Buffer.from(flatcwasmb64, 'base64');
  }else{
    let raw = window.atob(flatcwasmb64);
    let rawLength = raw.length;
    let array = new Uint8Array(new ArrayBuffer(rawLength));
    for(let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    wasmBinary = array;
  }
  `
  ),
  resolve(),
  commonjs(),
  builtins({ preferBuiltins: true }),
  url({
    limit: 1e35,
    include: ["**/*.wasm"],
    emitFiles: true
  }),
  //terser({ output: { comments: false } }),
  //brotli()
];
const external = ["child_process", "url", "fs", "crypto", "tty", "path"];
export default [
  {
    input: "./src/flatbuffers.js",
    output: {
      file: "./dist/browser.flatbuffers.js",
      format: "esm"
    },
    plugins: [
      replacr(/const wasmBinary[^;]{1,};/, ``),
      replacr(/import[\s\S]{1,}@wasmer\/wasi["'`];[^;]{1,};/, `import WASI from "@wasmer/wasi";`),
      replacr(/this.bindings.path/g, "this.bindings.path.default"),
      ...plugins
    ],
    external
  },
  {
    input: "./src/flatbuffers.js",
    output: {
      file: "./dist/flatbuffers.js",
      format: "esm"
    },
    plugins: [replacr(/import[\s\S]{1,}@wasmer\/wasi["'`];[^;]{1,};/, `import WASI from "@wasmer/wasi/lib/index.cjs";`, true), ...plugins],
    external
  },
  {
    input: "./src/flatbuffers.js",
    output: {
      file: "./dist/flatbuffers.cjs",
      format: "cjs"
    },
    plugins: [replacr(/import[\s\S]{1,}@wasmer\/wasi["'`];[^;]{1,};/, `import WASI from "@wasmer/wasi/lib/index.cjs";`, true), ...plugins],
    external
  }
];
