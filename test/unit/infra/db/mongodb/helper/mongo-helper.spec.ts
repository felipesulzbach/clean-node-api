import { MongoHelper as sut } from "../../../../../../src/infra/db/mongodb/helper/mongo-helper"

describe('infra :: db :: mongodb :: MongoHelper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  test('should reconnect if mongodb is down', async () => {
    let accountCollection = sut.getCollection('account')
    expect(accountCollection).toBeTruthy()

    await sut.disconnect()
    accountCollection = sut.getCollection('account')
    expect(accountCollection).toBeTruthy()
  })
})