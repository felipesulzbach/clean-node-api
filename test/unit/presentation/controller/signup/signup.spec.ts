import { AccountModel, AddAccount, AddAccountModel, EmailValidator } from "../../../../../src/presentation/controller/signup";
import { InvalidParamError, MissingParamError, ServerError } from "../../../../../src/presentation/error";
import { HttpRequest } from "../../../../../src/presentation/protocol";
import { SignUpController } from "../../../../../src/presentation/controller/signup/signup";
import { ok, serverError, badRequest } from "../../../../../src/presentation/helper/http-helper";

interface SutType {
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

const makeFakeAccount = () => ({
    id: 'any',
    name: 'any',
    email: 'any@any.com',
    password: 'any',
    passwordConfirmation: 'any'
})

const makeAddAccount = (): AddAccount => {
    class AddAccountStub implements AddAccount {
        async add(account: AddAccountModel): Promise<AccountModel> {
            return new Promise(resolve => resolve(makeFakeAccount()))
        }
    }
    return new AddAccountStub()
}

const makeFakeRequest = (): HttpRequest => {
    const fakeRequest = {
        body: Object.assign({}, makeFakeAccount())
    }
    delete fakeRequest.body.id

    return fakeRequest
}

const makeSut = (): SutType => {
    const emailValidatorStub = makeEmailValidator()
    const addAccountStub = makeAddAccount()
    const sut = new SignUpController(emailValidatorStub, addAccountStub)

    return {
        sut,
        emailValidatorStub,
        addAccountStub
    }
}

describe('presentation :: controller :: SignUpController', () => {
    test('should return 200 if valid data is provided', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(ok(makeFakeAccount()))
    })

    test('should return 400 if no name is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = Object.assign({}, makeFakeRequest())
        delete httpRequest.body.name
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
    })

    test('should return 400 if no email is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = Object.assign({}, makeFakeRequest())
        delete httpRequest.body.email
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
    })

    test('should return 400 if no password is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = Object.assign({}, makeFakeRequest())
        delete httpRequest.body.password
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
    })

    test('should return 400 if no passwordConfirmation is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = Object.assign({}, makeFakeRequest())
        delete httpRequest.body.passwordConfirmation
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
    })

    test('should return 400 if an invalid email is provided', async () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
    })

    test('should return 400 if password confirmation fails', async () => {
        const { sut } = makeSut()
        const httpRequest = Object.assign({}, makeFakeRequest())
        httpRequest.body.passwordConfirmation = 'invalid'
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
    })

    test('should call EmailValidator with correct email', async () => {
        const { sut, emailValidatorStub } = makeSut()
        const isValidEmail = jest.spyOn(emailValidatorStub, 'isValid')
        sut.handle(makeFakeRequest())
        expect(isValidEmail).toHaveBeenCalledWith('any@any.com')
    })

    test('should return 500 if an invalid email is provided', async () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new ServerError(null)))
    })

    test('should call AddAccount with correct values', async () => {
        const { sut, addAccountStub } = makeSut()
        const addSpy = jest.spyOn(addAccountStub, 'add')
        await sut.handle(makeFakeRequest())
        const response = Object.assign({}, makeFakeAccount())
        delete response.id
        delete response.passwordConfirmation
        expect(addSpy).toHaveBeenCalledWith(response)
    })

    test('should return 500 if an AddAccount throws', async () => {
        const { sut, addAccountStub } = makeSut()
        jest.spyOn(addAccountStub, 'add').mockRejectedValueOnce(new Error())
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new ServerError(null)))
    })
})
