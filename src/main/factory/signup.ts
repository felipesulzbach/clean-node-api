import { DbAddAccount } from "../../data/usercase/addaccount/db-add-account";
import { BcryptAdapter } from "../../infra/criptography/bcrypt-adapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/accountrepository/account";
import { SignUpController } from "../../presentation/controller/signup/signup";
import { Controller } from "../../presentation/protocol";
import { EmailValidatorAdapter } from "../../util/email-validator-adapter";
import { LogControllerDecorator } from "../decorator";
import { LogErrorRepository } from "../../data/protocol/log-error-repository";

export const makeSigUpController = (): Controller => {
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(12)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const signupController = new SignUpController(emailValidatorAdapter, dbAddAccount)
  return new LogControllerDecorator(signupController)
}