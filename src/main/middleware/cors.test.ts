import request from "supertest"
import app from "../config/app"

describe('main :: middleware :: CORS Middleware', () => {
  test('should enable CORS', async () => {
    app.post('/test_cors', (req, resp) => {
      resp.send(req.body)
    })

    await request(app).post('/test_cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*')
  })
})