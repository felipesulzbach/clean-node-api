import { AccountModel, AddAccountModel, AddAccountRepository, Encrypter } from "."
import { DbAddAccount } from "./db-add-account"

interface SutType {
  sut: DbAddAccount
  encrypterStub: Encrypter,
  addAccountRepositoryStub: AddAccountRepository
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed'))
    }
  }
  return new EncrypterStub()
}

const makeFakeAccount = () => ({
  name: 'any',
  email: 'any@any.com',
  password: 'any'
})

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(Object.assign({}, makeFakeAccount(), { id: 'any' })))
    }
  }
  return new AddAccountRepositoryStub()
}

const makeSut = (): SutType => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
  }
}

describe('data :: usercase :: DbAddAccount', () => {
  test('should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeAccount())
    expect(account).toEqual(Object.assign({}, makeFakeAccount(), { id: 'any' }))
  })

  test('should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.add(makeFakeAccount())
    expect(encryptSpy).toHaveBeenCalledWith('any')
  })

  test('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(new Error())
    const promise = sut.add(makeFakeAccount())
    expect(promise).rejects.toThrow()
  })

  test('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = Object.assign({}, makeFakeAccount())
    await sut.add(accountData)
    accountData.password = 'hashed'
    expect(addSpy).toHaveBeenCalledWith(accountData)
  })

  test('should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockRejectedValueOnce(new Error())
    const promise = sut.add(makeFakeAccount())
    expect(promise).rejects.toThrow()
  })
})