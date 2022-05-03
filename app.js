const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/db.sqlite3");

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

const headers = {
  "Content-Type": "application/x-www-form-urlencoded",
  Authorization:
    "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
};

const getAccessToken = async () => {
  const url = "https://accounts.spotify.com/api/token";
  return fetch(url, {
    method: "POST",
    headers,
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  }).then((data) => {
    return data.json();
  });
};

const getListens = async (at) => {
  const url = "https://api.spotify.com/v1/me/player/recently-played?limit=3";
  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${at}`,
    },
  }).then((res) => {
    return res.json();
  });
};

getAccessToken().then((d) => {
  getListens(d.access_token).then((listens) => {
    db.serialize(() => {
      const stmt = db.prepare(
        "INSERT INTO scrobbles (artists, name, played_at, spotify_id) VALUES (?,?,?,?)"
      );
      listens.items.forEach((item) => {
        const artists = item.track.artists.map((a) => a.name).join(", ");
        stmt.run(artists, item.track.name, item.played_at, item.track.id);
      });
      stmt.finalize();
    });
    db.close();
  });
});
