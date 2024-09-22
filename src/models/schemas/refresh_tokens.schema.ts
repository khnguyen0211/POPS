import { ObjectId } from 'mongodb'

type RefreshTokenType = {
  _id?: ObjectId
  token: string
  user_id: ObjectId
  iat: number
  exp: number
  create_at?: Date
}

export class RefreshToken {
  _id?: ObjectId
  token: string
  user_id: ObjectId
  iat: Date
  exp: Date
  create_at?: Date

  constructor(refreshToken: RefreshTokenType) {
    this._id = refreshToken._id || new ObjectId()
    this.token = refreshToken.token
    this.user_id = refreshToken.user_id
    this.iat = new Date(refreshToken.iat * 1000)
    this.exp = new Date(refreshToken.exp * 1000)
    this.create_at = refreshToken.create_at || new Date()
  }
}
