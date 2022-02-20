let flatc = require("../dist/flatc.cjs");

flatc.arguments = ["--js", "-o", "/test", "/test/monster.fbs"];

flatc({
    'noInitialRun': true,
    "arguments": ["--cpp", "-o", "/", "/monster.fbs"]
}).then(m => {

    m.FS.writeFile("/monsterFS.fbs", `// Example IDL file for our monster's schema.

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
    `);
    m.main(["--ts", "-o", "/", "/monsterFS.fbs"]);
    console.log(m.FS.readFile("/monsterFS.fbs", { encoding: 'utf8' }));
    console.log(m.FS.readdir("/"))
})
