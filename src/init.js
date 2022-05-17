const fs = require("fs");

const { sync } = require("./db");

if (fs.existsSync(process.cwd() + "/db.sqlite3")) {
  console.log("refusing to overwrite existing db.sqlite3 file");
  process.exit();
}

sync(() => {
  require("./server").listen(3000, () => {
    console.log("listening on http://localhost:3000/");
  });
});
