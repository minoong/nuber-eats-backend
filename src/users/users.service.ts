import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateAccountInput } from './dtos/create-account.dto'
import { LogintInput } from './dtos/login.dto'
import { User } from './entities/user.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<[boolean, string?]> {
    console.log(email)
    try {
      const exists = await this.users.findOne({ email })

      if (exists) {
        return [false, 'There is a user with that email already.']
      }

      await this.users.save(this.users.create({ email, password, role }))

      return [true]
    } catch (e) {
      return [false, `Couldn't create account`]
    }
  }

  async login({
    email,
    password,
  }: LogintInput): Promise<{ ok: boolean; error?: string; token?: string }> {
    try {
      const user = await this.users.findOne({ email })

      if (!user) {
        return {
          ok: false,
          error: 'user not found.',
        }
      }

      const passwordCorrect = await user.checkPassword(password)

      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'wrong password.',
        }
      }

      return {
        ok: true,
        token: 'lalalala',
      }
    } catch (error) {
      return {
        ok: true,
        error,
      }
    }
  }
}
