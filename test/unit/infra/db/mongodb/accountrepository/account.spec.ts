import { MongoHelper } from "../../../../../../src/infra/db/mongodb/helper/mongo-helper"
import { AccountMongoRepository } from "../../../../../../src/infra/db/mongodb/accountrepository/account"

const makeFakeAccount = () => ({
  name: 'any',
  email: 'any@any.com',
  password: 'any'
})

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

describe('db :: mongodb :: accountrepository :: AccountMongoRepository', () => {
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
    const sut = makeSut()
    const account = await sut.add(makeFakeAccount())
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any')
    expect(account.email).toBe('any@any.com')
    expect(account.password).toBe('any')
  })
})