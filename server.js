const http = require('http')
const clientId = process.env.SPOTIFY_CLIENT_ID
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
const scope = 'user-read-recently-played'
const port = process.env.PORT || 3000
const serverUrl = `http://localhost:${port}`
const redirectUri = `${serverUrl}/callback`
const authorizationUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}`

const getAccessAndRefreshTokens = async (code) => {
  let url = `https://accounts.spotify.com/api/token`
  const d = await fetch(url,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri
    })
  })
  return d.json()
}

const server = http.createServer((req, res) => {
  if(req.url.match(/callback/)){
    const params = req.url.split("?").pop().split("&").reduce((acc,el) => {
      const [key, value] = el.split("=")
      acc[key] = value
      return acc
    }, {})
    getAccessAndRefreshTokens(params.code).then(d => {
      res.end(JSON.stringify(d,null,2))
    })
  }
    
  if(req.url == '/')
    res.end(`<a href="${authorizationUrl}">Get Spotify Access Token</a>`)
})

server.listen(port, () => {
  console.log(`Server running at ${serverUrl}`)
})
