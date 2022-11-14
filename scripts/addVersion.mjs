import { readFileSync, writeFileSync } from "fs";

const { version } = JSON.parse(readFileSync("./package.json", "utf8"));
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
