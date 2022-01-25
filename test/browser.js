import WasmFs from "./wasmfs.esm.js";
import { flatc } from "../dist/browser.flatbuffers.js";
//import { flatc } from "https://digitalarsenal.io/lib/browser.flatbuffers.js";


const { fs } = new WasmFs();
window.fs = fs;

let fb = new flatc({
  fs: fs,
  rootDir: "/"
});
let monster = `// Example IDL file for our monster's schema.

namespace MyGame.Sample;

enum Color:byte { Red = 0, Green, Blue = 2 }

union Equipment { Weapon } // Optionally add more tables.

struct Vec3 {
  x:float;
  y:float;
  z:float;
}

table Monster {
  pos:Vec3;
  mana:short = 150;
  hp:short = 100;
  name:string;
  friendly:bool = false (deprecated);
  inventory:[ubyte];
  color:Color = Blue;
  weapons:[Weapon];
  equipped:Equipment;
  path:[Vec3];
}

table Weapon {
  name:string;
  damage:short;
}

root_type Monster;
`;

(async function () {
  fs.mkdirpSync('/test');
  fs.writeFileSync("/test/monster.fbs", monster);
  await fb.runCommand(["./flatc", "--js", "-o", "/test", "/test/monster.fbs"]);
  window.errPipe = fs.createReadStream("/dev/stderr");
  window.outPipe = fs.createReadStream("/dev/stdout");
  window.errPipe.on("data", data => {
    console.log(data.toString("utf8"));
  });
  window.outPipe.on("data", data => {
    console.log(data.toString("utf8"));
  });
  window.fs = fs;
  document.documentElement.innerHTML = `<h1>Main Thread</h1>${fs.readdirSync("/test/", { encoding: 'utf8' })}`;

  let flatWorker = new Worker("./worker.js", { type: "module" });
  flatWorker.onmessage = (msg) => {
    let data = (msg.data.error || msg.data.out) ? msg.data.error || msg.data.out : msg.data;
    console.log(data)
    document.documentElement.innerHTML = `<h1>Worker</h1>${data.toString().replace(/\n/g, '<br/>')}`;
  }
  flatWorker.postMessage({ idl: monster });
  setTimeout(() => {
    flatWorker.postMessage({ idl: "bad data" });
  }, 50000);

})();
