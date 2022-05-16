const http = require("http");
const scope = "user-read-recently-played";
const port = process.env.PORT || 3000;
const serverUrl = `http://localhost:${port}`;
const redirectUri = `${serverUrl}/callback`;
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

const database = async (callback) => {
  const db = new sqlite3.Database(`${process.cwd()}/db.sqlite3`);
  db.serialize(() => {
    callback(db);
  });
  db.close();
};

const getAccessAndRefreshTokens = async (code, clientId, clientSecret) => {
  let url = `https://accounts.spotify.com/api/token`;
  const d = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUri,
    }),
  });
  return d.json();
};

const queryStringToObject = (string) =>
  string
    .split("?")
    .pop()
    .split("&")
    .reduce((acc, el) => {
      const [key, value] = el.split("=");
      acc[key] = value;
      return acc;
    }, {});

const payload = async (req) => {
  const buffers = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }
  return Buffer.concat(buffers).toString();
};

const server = http.createServer(async (req, res) => {
  if (req.url == "/") {
    res.end(fs.readFileSync(__dirname + "/index.html", "utf8"));
  }

  if (req.url.match(/callback/)) {
    const params = queryStringToObject(req.url);
    database((db) => {
      db.get(
        "SELECT spotify_client_id, spotify_client_secret FROM auth limit 1",
        (_err, row) => {
          getAccessAndRefreshTokens(
            params.code,
            row.spotify_client_id,
            row.spotify_client_secret
          ).then((d) => {
            res.end(JSON.stringify(d, null, 2));
          });
        }
      );
    });
  }

  if (req.url == "/credentials") {
    const data = await payload(req);
    const { client_id, client_secret } = queryStringToObject(data);
    const authorizationUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${scope}&redirect_uri=http://localhost:3000/callback`;
    database((db) => {
      // TODO use upsert instead of multiple inserts
      const stmt = db.prepare(
        "INSERT INTO auth (spotify_client_id, spotify_client_secret) VALUES (?,?)"
      );
      stmt.run(client_id, client_secret);
      stmt.finalize();
    });
    res.writeHead(302, { Location: authorizationUrl });
    res.end();
  }
});

if (!module.parent) {
  server.listen(port, () => {
    console.log(`Server running at ${serverUrl}`);
  });
} else {
  module.exports = server;
}
