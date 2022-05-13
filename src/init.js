const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

if (fs.existsSync(process.cwd() + "/db.sqlite3")) {
  console.log("refusing to overwrite existing db.sqlite3 file");
  process.exit();
}

if(fs.existsSync(process.cwd() + "/.env")){
  console.log("refusing to overwrite existing .env file");
  process.exit();
}

fs.copyFileSync(__dirname + "/../.env.example", process.cwd() + "/.env")

const db = new sqlite3.Database(`${process.cwd()}/db.sqlite3`);

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS scrobbles (artists TEXT, name TEXT, played_at TEXT, spotify_id TEXT)"
  );
});

db.close();
