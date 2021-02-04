import bcrypt from "bcrypt"
import { BcryptAdapter } from "./bcrypt-adapter"

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise(resolve => resolve('hashed'))
  }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('infra :: criptography :: BcryptAdapter', () => {
  test('should call bcrypt with correct value', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any')
    expect(hashSpy).toHaveBeenCalledWith('any', salt)
  })

  test('should return a hash on sucess', async () => {
    const sut = makeSut()
    const hashed = await sut.encrypt('any')
    expect(hashed).toBe('hashed')
  })

  test('should throw if bcrypt throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockRejectedValueOnce(new Error())
    const promise = sut.encrypt('any')
    expect(promise).rejects.toThrow()
  })
})