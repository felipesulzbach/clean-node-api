import { MongoHelper } from "../helper/mongo-helper"
import { AccountMongoRepository } from "./account"

describe('db :: mongodb :: accountrepository :: AccountMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('account')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should return an account on success', async () => {
    const sut = new AccountMongoRepository()
    const account = await sut.add({
      name: 'any',
      email: 'any@any.com',
      password: 'any'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any')
    expect(account.email).toBe('any@any.com')
    expect(account.password).toBe('any')
  })
})