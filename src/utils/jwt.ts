import jwt from 'jsonwebtoken'
import { TokenPayload } from '~/models/requests/users.requests'

type SignTokenType = {
  payload: string | Buffer | object
  privateKey: string
  options?: jwt.SignOptions
}
export const signToken = ({ payload, privateKey, options = { algorithm: 'HS256' } }: SignTokenType) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) {
        return reject(error)
      }
      resolve(token as string)
    })
  })
}

export const verifyToken = ({ token, secretKey }: { token: string; secretKey: string }) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        throw reject(error)
      }
      return resolve(decoded as TokenPayload)
    })
  })
}
