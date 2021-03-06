import bcrypt from "bcrypt";
import { Encrypter } from "../../data/protocol/encrypter";

export class BcryptAdapter implements Encrypter {
  private readonly salt: number

  constructor(salt: number) {
    this.salt = salt
  }
  async encrypt(value: string): Promise<string> {
    const hashed = await bcrypt.hash(value, this.salt)
    return hashed
  }
}