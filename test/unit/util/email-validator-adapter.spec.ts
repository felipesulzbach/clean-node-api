import validator from "validator"
import { EmailValidatorAdapter } from "../../../src/util/email-validator-adapter"

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true
  }
}))

describe('util :: EmailValidatorAdapter', () => {
  test('should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid')
    expect(isValid).toBe(false)
  })

  test('should return true if validator returns true', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('any@any.com')
    expect(isValid).toBe(true)
  })

  test('should call validator with correct email', () => {
    const sut = new EmailValidatorAdapter()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid('any@any.com')
    expect(isEmailSpy).toHaveBeenCalledWith('any@any.com')
  })
})