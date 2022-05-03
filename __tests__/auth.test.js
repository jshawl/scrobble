const server = require("../server")
beforeAll(()=>{
  console.log(process.env)
  server.listen(3000)
})

afterAll( (done) => {
  server.close(done)
})

test("GET / shows a link to authorize", async () => {
  const res = await fetch("http://localhost:3000/")
  const body = await res.text()
  expect(body).toMatch('accounts.spotify.com/authorize')
  expect(body).not.toMatch('undefined')
  // If the above fails, you need to set environment variables.
})

// TODO: test access token retrieval
xtest("GET /callback?code=abc requests access token", async () => {
  const ftch = global.fetch
  const spy = jest.spyOn(global, 'fetch')
  await ftch("http://localhost:3000/callback?code=123")
  expect(spy).toHaveBeenCalledWith('https://accounts.spotify.com/api/token', expect.any(Object))
})
