import request from "supertest"
import { MongoHelper } from "../../../../src/infra/db/mongodb/helper/mongo-helper"
import app from "../../../../src/main/config/app"

describe('main :: route :: Signup Route', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('account')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should return an account on success', async () => {
    await request(app).post('/api/signup')
      .send({
        name: 'any',
        email: 'any@any.com',
        password: 'any',
        passwordConfirmation: 'any'
      })
      .expect(200)
  })
})