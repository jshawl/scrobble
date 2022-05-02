const clientId = process.env.SPOTIFY_CLIENT_ID
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN
const fs = require("fs")
const headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'Authorization': "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
}

const getAccessToken = async () => {
  const url = 'https://accounts.spotify.com/api/token'
  return fetch(url,{
    method: 'POST',
    headers,
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })
  }).then(data => {
    return data.json()
  })
}

const getListens = async (at) => {
  const url = 'https://api.spotify.com/v1/me/player/recently-played'
  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${at}`
    }
  }).then(res => {
    return res.json()
  })
}

getAccessToken().then(d => {
  console.log('access token', d.access_token)
  getListens(d.access_token).then(listens => {
    console.log('listens')
    console.log(listens)
    fs.writeFileSync("listens.json", JSON.stringify(listens, null, 2))
  })
})




