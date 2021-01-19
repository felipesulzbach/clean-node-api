import { AddAccountRepository } from "../../../../data/protocol/add-account-repository";
import { AccountModel } from "../../../../domain/model/account";
import { AddAccountModel } from "../../../../domain/usercase/add-account";
import { MongoHelper } from "../helper/mongo-helper";

export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const collection = MongoHelper.getCollection('account')
    const result = await collection.insertOne(accountData)
    return MongoHelper.map(result.ops[0])
  }
}