const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

if (fs.existsSync(process.cwd() + "/db.sqlite3")) {
  console.log("refusing to overwrite existing db.sqlite3 file");
  process.exit();
}

const db = new sqlite3.Database(`${process.cwd()}/db.sqlite3`);

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS scrobbles (artists TEXT, name TEXT, played_at TEXT, spotify_id TEXT)"
  );
});

console.log("  created db.sqlite3")

db.close();

const server = require("./server")
server.listen(3000, () => {
  console.log(`Visit http://localhost:3000/ in a browser.`)
})
