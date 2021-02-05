import request from "supertest"
import app from "../../../../src/main/config/app"

describe('main :: middleware :: Content Type Middleware', () => {
  test('should return default content type JSON', async () => {
    app.post('/test_content_type', (req, resp) => {
      resp.send('')
    })

    await request(app).post('/test_content_type')
      .expect('content-type', /json/)
  })

  test('should return XML content type when forced', async () => {
    app.post('/test_content_type_xml', (req, resp) => {
      resp.type('xml')
      resp.send('')
    })

    await request(app).post('/test_content_type_xml')
      .expect('content-type', /xml/)
  })
})