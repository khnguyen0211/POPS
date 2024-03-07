import { Action, Role, TokenType, UserStatus } from '~/constants/enums'
import { signToken, verifyToken } from '~/utils/jwt'
import databaseService from './database.service'
import { RefreshToken } from '~/models/schemas/refresh_tokens.schema'
import { ObjectId } from 'mongodb'
import { User } from '~/models/schemas/users.schema'
import { hashPassword } from '~/utils/crypto'
import { env_config } from '~/constants/config'

class UserService {
  private async signAccessToken({ user_id, status, role }: { user_id: string; status: UserStatus; role: Role }) {
    const access_token = await signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken,
        status,
        role
      },
      privateKey: env_config.jwt_access_token_secret_key,
      options: {
        expiresIn: env_config.jwt_access_token_expires
      }
    })
    return access_token
  }

  private async signEmailVerifyToken({ user_id, status, role }: { user_id: string; status: UserStatus; role: Role }) {
    const verify_token = await signToken({
      payload: {
        user_id,
        token_type: TokenType.VerifyToken,
        status,
        role
      },
      privateKey: env_config.jwt_verify_token_secret_key,
      options: {
        expiresIn: env_config.jwt_verify_token_expires
      }
    })
    return verify_token
  }

  private async signRefreshToken({
    user_id,
    status,
    exp,
    role
  }: {
    user_id: string
    status: UserStatus
    exp?: number
    role: Role
  }) {
    if (!exp) {
      const refresh_token = await signToken({
        payload: {
          user_id,
          token_type: TokenType.RefreshToken,
          status,
          role
        },
        privateKey: env_config.jwt_refresh_token_secret_key,
        options: {
          expiresIn: env_config.jwt_refresh_token_expires
        }
      })
      return refresh_token
    }
    const refresh_token = await signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken,
        status,
        role,
        exp
      },
      privateKey: env_config.jwt_refresh_token_secret_key
    })
    return refresh_token
  }

  private async addRefreshToken({
    user_id,
    token,
    iat,
    exp
  }: {
    user_id: string
    token: string
    iat: number
    exp: number
  }) {
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token,
        iat: iat,
        exp: exp
      })
    )
  }

  private async decodedToken({ token, secret_key }: { token: string; secret_key: string }) {
    return await verifyToken({ token, secretKey: secret_key })
  }

  async login({ user_id, status, role }: { user_id: string; status: UserStatus; role: Role }) {
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken({ user_id, status, role }),
      this.signRefreshToken({ user_id, status, role })
    ])
    const { iat, exp } = await this.decodedToken({
      token: refresh_token,
      secret_key: env_config.jwt_refresh_token_secret_key
    })

    await this.addRefreshToken({ user_id, token: refresh_token, iat, exp })
    return { access_token, refresh_token }
  }

  async logout(refresh_token: string) {
    const logout_result = await databaseService.refreshTokens.deleteOne({ token: refresh_token })
    return logout_result
  }

  async createStaffAccount({ email, full_name }: { email: string; full_name: string }) {
    const id = new ObjectId()
    const verify_token = await this.signEmailVerifyToken({
      user_id: id.toString(),
      status: UserStatus.Unverified,
      role: Role.Staff
    })
    const staffAccount = new User({
      _id: id,
      email,
      full_name,
      verify_token,
      password: hashPassword(email.split('@')[0]),
      role: Role.Staff
    })
    await databaseService.users.insertOne(staffAccount)
    return verify_token
  }

  async resendVerifyToken(user_id: string) {
    const verify_token = await this.signEmailVerifyToken({ user_id, status: UserStatus.Unverified, role: Role.Staff })
    const updated_result = await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          verify_token
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    const result = {
      updated_result,
      verify_token
    }
    return result
  }

  async createPassword({ user_id, password }: { user_id: string; password: string }) {
    const result = await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          password: hashPassword(password),
          verify_token: '',
          status: UserStatus.Verified
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    return result
  }

  async changePassword({ user_id, password }: { user_id: string; password: string }) {
    const result = await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          password: hashPassword(password)
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    return result
  }

  async getStaffList() {
    const staffs = await databaseService.users
      .find(
        {},
        {
          projection: {
            password: 0,
            username: 0,
            verify_token: 0,
            created_at: 0,
            updated_at: 0,
            inserted_by: 0
          }
        }
      )
      .sort({ created_at: -1 })
      .toArray()
    return staffs
  }

  async getStaffInfoById(user_id: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          password: 0,
          verify_token: 0,
          created_at: 0,
          updated_at: 0,
          inserted_by: 0
        }
      }
    )
    return user
  }

  async getUserById(user_id: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          password: 0,
          verify_token: 0,
          created_at: 0,
          updated_at: 0,
          inserted_by: 0
        }
      }
    )
    return user
  }

  async lockOrUnlock({ user_id, action }: { user_id: string; action: Action }) {
    switch (action) {
      case Action.Lock: {
        return await databaseService.users.updateOne(
          { _id: new ObjectId(user_id) },
          {
            $set: {
              status: UserStatus.Blocked
            },
            $currentDate: {
              updated_at: true
            }
          }
        )
      }
      case Action.Unlock: {
        return await databaseService.users.updateOne(
          { _id: new ObjectId(user_id) },
          {
            $set: {
              status: UserStatus.Verified
            },
            $currentDate: {
              updated_at: true
            }
          }
        )
      }
    }
  }

  async getMyProfile(user_id: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          password: 0,
          verify_token: 0,
          created_at: 0,
          updated_at: 0,
          inserted_by: 0
        }
      }
    )
    return user
  }

  async uploadAvatar({ user_id, avatar_url }: { user_id: string; avatar_url: string }) {
    return await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          avatar_url
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
  }

  async refreshToken({
    user_id,
    refresh_token,
    status,
    role
  }: {
    user_id: string
    refresh_token: string
    status: UserStatus
    role: Role
  }) {
    const [decoded_refresh_token] = await Promise.all([
      this.decodedToken({
        token: refresh_token,
        secret_key: env_config.jwt_refresh_token_secret_key
      }),
      databaseService.refreshTokens.deleteOne({ token: refresh_token })
    ])

    const { iat, exp } = decoded_refresh_token

    const [new_access_token, new_refresh_token] = await Promise.all([
      this.signAccessToken({ user_id, status, role }),
      this.signRefreshToken({ user_id, status, exp, role })
    ])

    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ token: new_refresh_token, user_id: new ObjectId(user_id), iat, exp })
    )
    return {
      access_token: new_access_token,
      refresh_token: new_refresh_token
    }
  }
}

export const userService = new UserService()
