const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(`${__dirname}/db.sqlite3`)

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS scrobbles (artists TEXT, name TEXT, played_at TEXT, spotify_id TEXT) ")
})

db.close()
