# 🎶 Scrobble 🎵

Self-hosted music listening history.

## Getting Started

### Create a Spotify Application

https://developer.spotify.com/dashboard/applications

### Copy .env.example to .env

And add the client id and client secret

### Obtain a refresh token

Start the server:

```
env $(cat .env | xargs) node server.js
```

Complete the oauth flow, then add the `refresh_token` to `.env`

### Run the app

```
env $(cat .env | xargs) node app.js
```

## Run Tests

```
env $(cat .env | xargs) npm test
```

## More Documentation

https://developer.spotify.com/documentation/general/guides/authorization/code-flow/
