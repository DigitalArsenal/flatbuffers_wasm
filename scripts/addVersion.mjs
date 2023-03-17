import { readFileSync, writeFileSync } from "fs";
import packageJSON from "../package.json" assert {type: "json"};

const { version } = JSON.parse(readFileSync("./packages/flatbuffers/package.json", "utf8"));
console.log(version);

let sourceExt = ["cjs", "mjs"];

sourceExt
  .map(
    (e) =>
      `//Converted From Flatbuffers ${version}\n` +
      readFileSync(`./dist/flatc.${e}`, "utf8")
  )
  .forEach((s, i) => {
    writeFileSync(`./dist/flatc.${sourceExt[i]}`, s);
  });

packageJSON.version = version;

writeFileSync("package.json", JSON.stringify(packageJSON, null, 4));