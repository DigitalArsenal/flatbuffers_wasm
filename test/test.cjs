const { flatc } = require("../dist/flatbuffers.cjs");

const path = require("path");
const fs = require("fs");

(async function() {
  let rootDir = __dirname;
  let fb = new flatc({ fs, rootDir });

  let result1 = await fb.runCommand(["./flatc", "--cpp", "-o", "/", "/monster.fbs"]);
  console.log(result1);
})();
