import { InvalidParamError, MissingParamError, ServerError } from "../../error";
import { SignUpController } from "./signup";
import { AccountModel, AddAccount, AddAccountModel, EmailValidator } from "./signup-protocol";

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const addAccountStub = makeAddAccount()
    const sut = new SignUpController(emailValidatorStub, addAccountStub)

    return {
        sut,
        emailValidatorStub,
        addAccountStub
    }
}

interface SutTypes {
    sut: SignUpController
    emailValidatorStub: EmailValidator,
    addAccountStub: AddAccount
}

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
    class AddAccountStub implements AddAccount {
        async add(account: AddAccountModel): Promise<AccountModel> {
            const fakeAccount = {
                id: 'any',
                name: 'any',
                email: 'any@any.com',
                password: 'any',
                passwordConfirmation: 'any'
            }
            return new Promise(resolve => resolve(fakeAccount))
        }
    }
    return new AddAccountStub()
}

describe('presentation :: controller :: SignUpController', () => {
    test('should return 200 if valid data is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'any',
                email: 'any@any.com',
                password: 'any',
                passwordConfirmation: 'any'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(200)
        expect(httpResponse.body).toEqual({
            id: 'any',
            name: 'any',
            email: 'any@any.com',
            password: 'any',
            passwordConfirmation: 'any'
        })
    })

    test('should return 400 if no name is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                email: 'any@any.com',
                password: 'any',
                passwordConfirmation: 'any'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('name'))
    })

    test('should return 400 if no email is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'any',
                password: 'any',
                passwordConfirmation: 'any'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })

    test('should return 400 if no password is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'any',
                email: 'any@any.com',
                passwordConfirmation: 'any'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('password'))
    })

    test('should return 400 if no passwordConfirmation is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'any',
                email: 'any@any.com',
                password: 'any'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
    })

    test('should return 400 if an invalid email is provided', async () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const httpRequest = {
            body: {
                name: 'any',
                email: 'invalid',
                password: 'any',
                passwordConfirmation: 'any'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    })

    test('should return 400 if password confirmation fails', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'any',
                email: 'invalid',
                password: 'any',
                passwordConfirmation: 'invalid'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
    })

    test('should call EmailValidator with correct email', async () => {
        const { sut, emailValidatorStub } = makeSut()
        const isValidEmail = jest.spyOn(emailValidatorStub, 'isValid')
        const httpRequest = {
            body: {
                name: 'any',
                email: 'any@any.com',
                password: 'any',
                passwordConfirmation: 'any'
            }
        }
        sut.handle(httpRequest)
        expect(isValidEmail).toHaveBeenCalledWith('any@any.com')
    })

    test('should return 500 if an invalid email is provided', async () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })
        const httpRequest = {
            body: {
                name: 'any',
                email: 'any@any.com',
                password: 'any',
                passwordConfirmation: 'any'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })

    test('should call AddAccount with correct values', async () => {
        const { sut, addAccountStub } = makeSut()
        const addSpy = jest.spyOn(addAccountStub, 'add')
        const httpRequest = {
            body: {
                name: 'any',
                email: 'any@any.com',
                password: 'any',
                passwordConfirmation: 'any'
            }
        }
        await sut.handle(httpRequest)
        expect(addSpy).toHaveBeenCalledWith({
            name: 'any',
            email: 'any@any.com',
            password: 'any',
            passwordConfirmation: 'any'
        })
    })

    test('should return 500 if an AddAccount throws', async () => {
        const { sut, addAccountStub } = makeSut()
        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
            return new Promise((resolve, reject) => reject(new Error()))
        })
        const httpRequest = {
            body: {
                name: 'any',
                email: 'any@any.com',
                password: 'any',
                passwordConfirmation: 'any'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })
})
