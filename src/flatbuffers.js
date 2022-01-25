/**
 * ECMAScript Interface to WASM port of flatbuffers (https://google.github.io/flatbuffers/)
 * @module Flatbuffers
 *
 * @license Apache-2.0
 * @copyright 2020 DIGITALARSENAL.IO, INC.
 */

import { run } from "./command.js";
import { isNode, workerShim } from "./isNode.js";

/*Shim to use WorkerGlobalContext*/
workerShim();

/* Default path to the WebAssembly file */
const flatcWasmPath = "flatc.wasm";

/** Class representing an flatc session */
export class flatc {
  /**
   * Create an flatc instance
   * @param {Object} args
   * @param {Object} fs - The file system object to use
   * @param {string} rootDir - The file system root path to use
   */
  constructor(args) {
    if (!args) throw Error("Arguments Not Defined");

    if (!args.fs) throw Error("FileSystem Not Defined.");

    if (!args.rootDir) args.rootDir = "/";

    Object.assign(this, { ...args }, { wasmBinaryPath: flatcWasmPath });

    const { readFileSync, mkdirSync, existsSync } = this.fs;

    this.runCommand = async command => {
      if (!existsSync(this.rootDir)) mkdirSync(this.rootDir);

      if (isNode) {
        const { fileURLToPath } = await import("url");
        const { dirname, resolve } = await import("path");
        const _filename = fileURLToPath(import.meta.url);
        const _dirname = dirname(_filename);
        const wasmBinary = readFileSync(resolve(_dirname, this.wasmBinaryPath));
        return run({ command, wasmBinary, ...this });
      } else {
        let response;
        let responseArrayBuffer;
        if (args.wasmBinaryPath) {
          response = await fetch(args.wasmBinaryPath);
        }
        if (response && response.arrayBuffer) {
          responseArrayBuffer = await response.arrayBuffer();
        }
        const wasmBinary = new Uint8Array(responseArrayBuffer);
        if (wasmBinary.length) {
          return run({ command, wasmBinary, ...this });
        }
      }
    };
  }
}
