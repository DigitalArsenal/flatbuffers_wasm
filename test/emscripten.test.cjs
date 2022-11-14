let flatc = require("../dist/flatc.cjs");
let fs = require('fs');

flatc({
    'noInitialRun': true
}).then(m => {
    let e = { encoding: "utf8" };
    m.FS.writeFile("/OMM.module.fbs", 
    fs.readFileSync('./test/omm.fbs', e)
    .replace(/namespace .*/g, "")
    );
    m.main(["--help"]);
    m.main(["--jsonschema", "/OMM.module.fbs"]);
    console.log(m.FS.readdir("/"));
    console.log(m.FS.readFile("/OMM.module.schema.json", e));
})
