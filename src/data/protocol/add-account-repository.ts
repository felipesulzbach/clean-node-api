import { AccountModel } from "../../domain/model/account";
import { AddAccountModel } from "../../domain/usercase/add-account";

export interface AddAccountRepository {
  add(accountData: AddAccountModel): Promise<AccountModel>
}