import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { User } from 'src/users/entities/user.entity'
import { UsersService } from 'src/users/users.service'
import { JwtService } from './jwt.service'

interface RequestCustom extends Request {
  user?: User
}

@Injectable()
export class JwtMiddleware implements NestMiddleware<Request, Response> {
  constructor(
    private readonly jwtServicce: JwtService,
    private readonly userService: UsersService,
  ) {}

  async use(req: RequestCustom, res: Response, next: NextFunction) {
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt']

      try {
        const decoded = this.jwtServicce.verify(token.toString())

        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          const { user, ok } = await this.userService.findById(decoded['id'])

          if (ok) {
            req['user'] = user
          }
        }
      } catch (e) {
        console.log(e)
      }
    }
    next()
  }
}
