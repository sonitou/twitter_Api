import { TokenPayload } from './models/requests/User.requests'
import User from './models/schemas/User.schemas'
import { Request } from 'express'

declare module 'express' {
  interface Request {
    user?: User
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
  }
}
