import validator from "validator";
import { EmailValidator } from "../presentation/protocol/email-validator";

export class EmailValidatorAdapter implements EmailValidator {
  isValid(email: string): boolean {
    return validator.isEmail(email)
  }
}