import request from "supertest"
import app from "../../../../src/main/config/app"

describe('main :: middleware :: Body Parser Middleware', () => {
  test('should parse body as JSON', async () => {
    app.post('/test_body_parser', (req, resp) => {
      resp.send(req.body)
    })

    await request(app).post('/test_body_parser')
      .send({ name: 'Any' }).expect({ name: 'Any' })
  })
})