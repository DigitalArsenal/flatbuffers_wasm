import { flatc } from "../dist/flatbuffers.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
fs.rmdirSync(`${__dirname}/output/ts`, { recursive: true });
fs.mkdirSync(`${__dirname}/output/ts`);
(async function () {
  let rootDir = __dirname;
  let fb = new flatc({ fs, rootDir });

  let result1 = await fb.runCommand(["./flatc", "--ts", "--gen-object-api", "-o", "/output/ts", "/omm.fbs"]);
  console.log(result1);
  let result2 = await fb.runCommand(["./flatc", "--version"]);
  console.log(result2);
})();
