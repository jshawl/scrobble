const http = require("http");
const scope = "user-read-recently-played";
const port = process.env.PORT || 3000;
const serverUrl = `http://localhost:${port}`;
const redirectUri = `${serverUrl}/callback`;
const fs = require("fs");
const {KV} = require("./db");

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
  return d.json()
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
    const client_id = await KV.findOne({where: {key: 'spotify_client_id'}})
    const client_secret = await KV.findOne({where: {key: 'spotify_client_secret'}})
    getAccessAndRefreshTokens(
      params.code,
      client_id.value,
      client_secret.value
    ).then(async (data) => {
      console.log(data)
      await KV.findOrCreate({where: {
        key: 'spotify_refresh_token',
        value: data.refresh_token
      }})
      res.end('ok')
    })
  }

  if (req.url == "/credentials") {
    const data = await payload(req);
    const { client_id, client_secret } = queryStringToObject(data);
    const authorizationUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${scope}&redirect_uri=http://localhost:3000/callback`;
    await KV.findOrCreate({where: {key: 'spotify_client_id', value: client_id}});
    await KV.findOrCreate({where: {key: 'spotify_client_secret', value: client_secret}});
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
