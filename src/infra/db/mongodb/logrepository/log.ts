import { LogErrorRepository } from "../../../../data/protocol/log-error-repository";
import { MongoHelper } from "../helper/mongo-helper";

export class LogMongoRepository implements LogErrorRepository {
  async logError(stack: string): Promise<void> {
    const collection = await MongoHelper.getCollection('error')
    await collection.insertOne({
      stack,
      date: (new Date()).toISOString()
    })
  }
}