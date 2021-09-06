import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CreateAccountInput } from './dtos/create-account.dto'
import { User } from './entities/user.entity'
import { UsersService } from './users.service'

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query((returns) => Boolean)
  hi() {
    return true
  }

  @Mutation((returns) => Boolean)
  createAccount(@Args('input') createAccountInput: CreateAccountInput) {
    return true
  }
}
