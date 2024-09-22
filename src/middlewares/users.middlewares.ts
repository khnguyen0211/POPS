import { NextFunction, Request, Response } from 'express'
import { ParamSchema, check, checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'
import { ObjectId } from 'mongodb'
import { env_config } from '~/constants/config'
import { Role, UserStatus } from '~/constants/enums'
import { SERVER_MESSAGES } from '~/constants/messages'
import { SERVER_STATUS_CODE } from '~/constants/statuses'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayload } from '~/models/requests/users.requests'
import databaseService from '~/services/database.service'
import { userService } from '~/services/users.service'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'

const passwordSchema: ParamSchema = {
  trim: true,
  notEmpty: {
    errorMessage: SERVER_MESSAGES.PASSWORD_IS_REQUIRED
  },
  isLength: {
    options: {
      min: 8,
      max: 50
    }
  },
  isStrongPassword: {
    errorMessage: 'errors password',
    options: {
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1
    }
  }
}
const confirmPasswordSchema: ParamSchema = {
  trim: true,
  notEmpty: {
    errorMessage: SERVER_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
  },
  isLength: {
    options: {
      min: 8,
      max: 50
    }
  },
  isStrongPassword: {
    errorMessage: 'errors password',
    options: {
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1
    }
  },
  custom: {
    options: (value, { req }) => {
      if (value != req.body.password) {
        throw new Error('Confirm password is incorrect')
      }
      return true
    }
  }
}

export const loginValidator = validate(
  checkSchema(
    {
      username: {
        notEmpty: {
          errorMessage: SERVER_MESSAGES.USERNAME_IS_REQUIRED
        },
        custom: {
          options: async (value, { req }) => {
            const { password } = req.body
            const user = await databaseService.users.findOne({ username: value, password: hashPassword(password) })
            if (!user) {
              throw new ErrorWithStatus({
                message: SERVER_MESSAGES.LOGIN_FAILED,
                status_code: SERVER_STATUS_CODE.NOT_FOUND
              })
            }
            ;(req as Request).user = user
            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: SERVER_MESSAGES.PASSWORD_IS_REQUIRED
        }
      }
    },
    ['body']
  )
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        notEmpty: {
          errorMessage: SERVER_MESSAGES.ACCESS_TOKEN_IS_REQUIRED
        },
        custom: {
          options: async (value: string, { req }) => {
            const accessToken = value.split(' ')[1]
            if (!accessToken) {
              throw new ErrorWithStatus({
                message: SERVER_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
                status_code: SERVER_STATUS_CODE.UNAUTHORIZED
              })
            }
            try {
              const decoded_author = await verifyToken({
                token: accessToken,
                secretKey: env_config.jwt_access_token_secret_key
              })
              ;(req as Request).decoded_authorization = decoded_author
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: capitalize(error.message),
                  status_code: SERVER_STATUS_CODE.UNAUTHORIZED
                })
              }
              throw error
            }

            return true
          }
        }
      }
    },
    ['headers']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        notEmpty: {
          errorMessage: SERVER_MESSAGES.REFRESH_TOKEN_IS_REQUIRED
        },
        custom: {
          options: async (value, { req }) => {
            try {
              const [decoded_refresh_token, refresh_token] = await Promise.all([
                verifyToken({ token: value, secretKey: env_config.jwt_refresh_token_secret_key }),
                databaseService.refreshTokens.findOne({ token: value })
              ])
              //not found the token in database => user already logged out or token not exists
              if (refresh_token == null) {
                throw new ErrorWithStatus({
                  message: SERVER_MESSAGES.REFRESH_TOKEN_IS_USED_OR_NOT_EXIST,
                  status_code: SERVER_STATUS_CODE.UNAUTHORIZED
                })
              }

              ;(req as Request).decoded_refresh_token = decoded_refresh_token
            } catch (error) {
              //decoded token failed
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: SERVER_MESSAGES.REFRESH_TOKEN_IS_INVALID,
                  status_code: SERVER_STATUS_CODE.UNAUTHORIZED
                })
              }
              throw error
            }
          }
        }
      }
    },
    ['body']
  )
)

export const managerRoleValidator = (req: Request, res: Response, next: NextFunction) => {
  const { role } = req.decoded_authorization as TokenPayload
  if (role != Role.Manager) {
    return res.status(SERVER_STATUS_CODE.FORBIDDEN).json(SERVER_MESSAGES.ACCOUNT_FORBIDDEN)
  }
  return next()
}

export const createAccountValidator = validate(
  checkSchema({
    full_name: {
      notEmpty: {
        errorMessage: SERVER_MESSAGES.FULL_NAME_IS_REQUIRED
      },
      trim: true
    },
    email: {
      isEmail: {
        errorMessage: SERVER_MESSAGES.INVALID_EMAIL_FORMAT
      },
      custom: {
        options: async (value: string) => {
          const user = await databaseService.users.findOne({ email: value })
          if (!user) {
            return true
          }
          throw new ErrorWithStatus({
            message: SERVER_MESSAGES.EMAIL_ALREADY_EXISTS,
            status_code: SERVER_STATUS_CODE.CONFLICT
          })
        }
      }
    }
  })
)

export const verifyTokenValidator = validate(
  checkSchema(
    {
      verify_token: {
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const email_token = value
            if (!email_token) {
              throw new ErrorWithStatus({
                message: SERVER_MESSAGES.EMAIL_VERIFY_TOKEN_IS_REQUIRED,
                status_code: SERVER_STATUS_CODE.UNAUTHORIZED
              })
            }

            try {
              const decoded_email_verify_token = await verifyToken({
                token: email_token,
                secretKey: env_config.jwt_verify_token_secret_key
              })
              ;(req as Request).decoded_verify_token = decoded_email_verify_token
            } catch (error) {
              throw new ErrorWithStatus({
                message: capitalize((error as JsonWebTokenError).message),
                status_code: SERVER_STATUS_CODE.UNAUTHORIZED
              })
            }
          }
        }
      }
    },
    ['body']
  )
)

export const userVerifyValidator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.body
    const user = await databaseService.users.findOne({ username })
    if (!user) {
      throw new ErrorWithStatus({
        message: SERVER_MESSAGES.NOT_FOUND_USER_BY_USERNAME,
        status_code: SERVER_STATUS_CODE.NOT_FOUND
      })
    }
    if (user.status === UserStatus.Unverified) {
      throw new ErrorWithStatus({
        message: SERVER_MESSAGES.USER_NOT_VERIFIED,
        status_code: SERVER_STATUS_CODE.FORBIDDEN
      })
    }
    if (user.status === UserStatus.Blocked) {
      throw new ErrorWithStatus({
        message: SERVER_MESSAGES.USER_IS_BLOCKED,
        status_code: SERVER_STATUS_CODE.FORBIDDEN
      })
    }
    return next()
  } catch (error) {
    next(error)
  }
}

export const emailValidator = validate(
  checkSchema({
    staff_email: {
      notEmpty: {
        errorMessage: SERVER_MESSAGES.EMAIL_IS_REQUIRED
      },
      isEmail: {
        errorMessage: SERVER_MESSAGES.INVALID_EMAIL_FORMAT
      },
      custom: {
        options: async (value, { req }) => {
          const user = await databaseService.users.findOne({ email: value })
          if (!user) {
            throw new ErrorWithStatus({
              message: SERVER_MESSAGES.EMAIL_NOT_FOUND,
              status_code: SERVER_STATUS_CODE.NOT_FOUND
            })
          }
          if (user.verify_token === '') {
            throw new ErrorWithStatus({
              message: SERVER_MESSAGES.ACCOUNT_ALREADY_VERIFIED,
              status_code: SERVER_STATUS_CODE.CONFLICT
            })
          }
          ;(req as Request).user = user
        }
      }
    }
  })
)

export const createPasswordValidator = validate(
  checkSchema({
    password: passwordSchema,
    confirm_password: confirmPasswordSchema
  })
)

export const changePasswordValidator = validate(
  checkSchema({
    old_password: {
      notEmpty: {
        errorMessage: SERVER_MESSAGES.OLD_PASSWORD_IS_REQUIRED
      },
      custom: {
        options: async (value, { req }) => {
          const { user_id } = (req as Request).decoded_authorization as TokenPayload

          const user = await databaseService.users.findOne({
            _id: new ObjectId(user_id),
            password: hashPassword(value)
          })
          if (!user) {
            throw new ErrorWithStatus({
              message: SERVER_MESSAGES.OLD_PASSWORD_IS_INCORRECT,
              status_code: SERVER_STATUS_CODE.NOT_FOUND
            })
          }
        }
      }
    },
    password: passwordSchema,
    confirm_password: confirmPasswordSchema
  })
)

export const lockedStatusValidator = validate(
  checkSchema({
    user_id: {
      notEmpty: {
        errorMessage: SERVER_MESSAGES.USER_ID_IS_REQUIRED
      },
      custom: {
        options: async (value) => {
          const user = await databaseService.users.findOne({ _id: new ObjectId(value) })
          if (!user) {
            throw new ErrorWithStatus({
              message: SERVER_MESSAGES.NOT_FOUND_USER_BY_ID,
              status_code: SERVER_STATUS_CODE.NOT_FOUND
            })
          }
          if (user.status === UserStatus.Blocked) {
            throw new ErrorWithStatus({
              message: SERVER_MESSAGES.USER_ALREADY_BLOCKED_BEFORE,
              status_code: SERVER_STATUS_CODE.CONFLICT
            })
          }
          return true
        }
      }
    }
  })
)

export const unlockedStatusValidator = validate(
  checkSchema({
    user_id: {
      notEmpty: {
        errorMessage: SERVER_MESSAGES.USER_ID_IS_REQUIRED
      },
      custom: {
        options: async (value) => {
          const user = await databaseService.users.findOne({ _id: new ObjectId(value) })
          if (!user) {
            throw new ErrorWithStatus({
              message: SERVER_MESSAGES.NOT_FOUND_USER_BY_ID,
              status_code: SERVER_STATUS_CODE.NOT_FOUND
            })
          }
          if (user.status === UserStatus.Verified) {
            throw new ErrorWithStatus({
              message: SERVER_MESSAGES.USER_ALREADY_VERIFIED_BEFORE,
              status_code: SERVER_STATUS_CODE.FORBIDDEN
            })
          }
          return true
        }
      }
    }
  })
)
