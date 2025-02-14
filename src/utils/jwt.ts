import { config } from 'dotenv'
import jwt, { SignOptions } from 'jsonwebtoken'
import { TokenPayload } from '~/models/requests/User.requests'
config()

export const signToken = ({
  payload,
  privateKey,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: string | Buffer | object
  privateKey: string
  options?: SignOptions
}) => {
  return new Promise<string>((resolve, rejects) => {
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) {
        return rejects(error)
      }
      resolve(token as string)
    })
  })
}

export const verifyToken = ({
  token,
  publicKey = process.env.JWT_SECRET as string
}: {
  token: string
  publicKey?: string
}) => {
  return new Promise<TokenPayload>((resolve, rejects) => {
    jwt.verify(token, publicKey, (error, decoded) => {
      if (error) {
        return rejects(error)
      }
      resolve(decoded as TokenPayload)
    })
  })
}
