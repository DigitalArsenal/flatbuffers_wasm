import { flatc } from "../dist/flatbuffers.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let lang = ["ts", "json", "python", "go", "dart", "rust", "java", "cpp"];
for (let l = 0; l < lang.length; l++) {
  let thisLang = lang[l];

  try {
    fs.rmdirSync(`${__dirname}/output/${thisLang}`, { recursive: true });
  } catch (e) { }
  fs.mkdirSync(`${__dirname}/output/${thisLang}`);
  (async function () {
    let rootDir = __dirname;
    let fb = new flatc({ fs, rootDir });
    let result1 = await fb.runCommand(["./flatc", `--${thisLang}`, "--gen-object-api", "-o", `/output/${thisLang}`, "/omm.fbs"]);
    console.log(result1);
    let result2 = await fb.runCommand(["./flatc", "--version"]);
    console.log(result2);
  })();
}