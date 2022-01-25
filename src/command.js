/**
 * ECMAScript Interface to WASM port of flatbuffers (https://google.github.io/flatbuffers/)
 * @module Flatbuffers
 *
 * @license Apache-2.0
 * @copyright 2020 DIGITALARSENAL.IO, INC.
 */

import _WASI from "@wasmer/wasi";
const WASI = isNode ? _WASI.WASI : _WASI; //module issue
import { isNode } from "./isNode.js";

export const run = async (args) => {
  let _filename;
  try {
    _filename = __filename;
  } catch (e) {}
  if (isNode && !_filename) {
    const { fileURLToPath } = await import("url"); //SyntaxError: Parenthesized pattern ({fileURLToPath})
    _filename = fileURLToPath(import.meta.url);
  }

  let command = Array.isArray(args.command)
    ? args.command
    : ["flatc"].concat(args.command.split(/[\s]{1,}/g).filter(Boolean));

  let { fs, rootDir, env, wasmBinary } = args;
  let wasi = new WASI({
    args: command,
    env: env,
    preopenDirectories: {
      "/": rootDir,
    },
    bindings: {
      ...WASI.defaultBindings,
      fs,
    },
  });

  let { instance } = await WebAssembly.instantiate(wasmBinary, {
    wasi_unstable: wasi.wasiImport,
    wasi_snapshot_preview1: wasi.wasiImport,
  });

  wasi.start(instance);
};
