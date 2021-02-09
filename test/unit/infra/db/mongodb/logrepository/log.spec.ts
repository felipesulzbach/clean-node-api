import { Collection } from "mongodb"
import { MongoHelper } from "../../../../../../src/infra/db/mongodb/helper/mongo-helper"
import { LogMongoRepository } from "../../../../../../src/infra/db/mongodb/logrepository/log"

const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository()
}

describe('db :: mongodb :: logrepository :: LogRepository', () => {
  let errorCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL, process.env.MONGO_OPTIONS)
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('error')
    await errorCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should create an error log  on success', async () => {
    const sut = makeSut()
    await sut.logError('any')
    const countErrorLogs = await errorCollection.countDocuments()
    expect(countErrorLogs).toBe(1)
  })
})