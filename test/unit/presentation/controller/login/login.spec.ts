import { Authentication, EmailValidator, HttpRequest } from ".";
import { LoginController } from "../../../../../src/presentation/controller/login/login";
import { MissingParamError, InvalidParamError, ServerError } from "../../../../../src/presentation/error";
import { badRequest, ok, serverError, unauthorized } from "../../../../../src/presentation/helper/http-helper";

interface SutType {
    sut: LoginController
    emailValidatorStub: EmailValidator
    authenticationStub: Authentication
}

const makeFakeLogin = () => ({
    id: 'any',
    email: 'any@any.com',
    password: 'any',
    passwordConfirmation: 'any'
})

const makeFakeRequest = (): HttpRequest => {
    const fakeRequest = {
        body: Object.assign({}, makeFakeLogin())
    }
    delete fakeRequest.body.id

    return fakeRequest
}

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}

const makeAuthenticationStub = (): Authentication => {
    class AuthenticationStub implements Authentication {
        async auth(email: string, password: string): Promise<string> {
            return 'any'
        }
    }
    return new AuthenticationStub()
}

const makeSut = (): SutType => {
    const emailValidatorStub = makeEmailValidator()
    const authenticationStub = makeAuthenticationStub()
    const sut = new LoginController(emailValidatorStub, authenticationStub)

    return {
        sut,
        emailValidatorStub,
        authenticationStub
    }
}

describe('presentation :: controller :: LoginController', () => {
    test('should return 200 if valid data is provided', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(ok({ accessToken: 'any' }))
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

    test('should return 400 if an invalid email is provided', async () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
    })

    test('should return 500 if an invalid email is provided', async () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new ServerError(null)))
    })

    test('should return 500 if an Authentication throws', async () => {
        const { sut, authenticationStub } = makeSut()
        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve(null)))
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(unauthorized())
    })

    test('should return 500 if an Authentication throws', async () => {
        const { sut, authenticationStub } = makeSut()
        jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
            throw new Error()
        })
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new ServerError(null)))
    })

    test('should call EmailValidator with correct email', async () => {
        const { sut, emailValidatorStub } = makeSut()
        const isValidEmail = jest.spyOn(emailValidatorStub, 'isValid')
        sut.handle(makeFakeRequest())
        expect(isValidEmail).toHaveBeenCalledWith('any@any.com')
    })

    test('should call Authentication with correct values', async () => {
        const { sut, authenticationStub } = makeSut()
        const authSpy = jest.spyOn(authenticationStub, 'auth')
        await sut.handle(makeFakeRequest())
        expect(authSpy).toHaveBeenCalledWith('any@any.com', 'any')
    })
})
