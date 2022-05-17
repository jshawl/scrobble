const { KV, Scrobble } = require("./db");

const getAccessToken = async () => {
  const url = "https://accounts.spotify.com/api/token";
  const clientId = await KV.findOne({ where: { key: "spotify_client_id" } });
  const clientSecret = await KV.findOne({
    where: { key: "spotify_client_secret" },
  });
  const refreshToken = await KV.findOne({
    where: { key: "spotify_refresh_token" },
  });
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization:
      "Basic " +
      Buffer.from(`${clientId.value}:${clientSecret.value}`).toString("base64"),
  };
  return fetch(url, {
    method: "POST",
    headers,
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken.value,
    }),
  }).then((data) => {
    return data.json();
  });
};

const getListens = async (at) => {
  const url = "https://api.spotify.com/v1/me/player/recently-played";
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
    listens.items.forEach(async (item) => {
      const artists = item.track.artists.map((a) => a.name).join(", ");
      const [name, created] = await Scrobble.upsert({
        artists,
        name: item.track.name,
        played_at: item.played_at,
        spotify_id: item.track.id,
      });
      if (created) {
        console.log(name);
      }
    });
  });
});
