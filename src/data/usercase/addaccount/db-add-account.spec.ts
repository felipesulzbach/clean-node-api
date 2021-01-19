import { DbAddAccount } from "./db-add-account"
import { AccountModel, AddAccountModel, Encrypter, AddAccountRepository } from "./db-add-account-protocol"

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
  }
}

interface SutTypes {
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

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'any',
        name: 'any',
        email: 'any@any.com',
        password: 'any'
      }
      return new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAccountRepositoryStub()
}

describe('data :: usercase :: DbAddAccount', () => {
  test('should return an account on success', async () => {
    const { sut } = makeSut()
    const accountData = {
      id: 'any',
      name: 'any',
      email: 'any@any.com',
      password: 'any'
    }
    const account = await sut.add(accountData)
    expect(account).toEqual({
      id: 'any',
      name: 'any',
      email: 'any@any.com',
      password: 'any'
    })
  })

  test('should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'any',
      email: 'any@any.com',
      password: 'any'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('any')
  })

  test('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(new Error())
    const accountData = {
      name: 'any',
      email: 'any@any.com',
      password: 'any'
    }
    const promise = sut.add(accountData)
    expect(promise).rejects.toThrow()
  })

  test('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = {
      name: 'any',
      email: 'any@any.com',
      password: 'any'
    }
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any',
      email: 'any@any.com',
      password: 'hashed'
    })
  })

  test('should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockRejectedValueOnce(new Error())
    const accountData = {
      name: 'any',
      email: 'any@any.com',
      password: 'any'
    }
    const promise = sut.add(accountData)
    expect(promise).rejects.toThrow()
  })
})