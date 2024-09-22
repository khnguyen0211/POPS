import { Request, Response, NextFunction } from 'express'
import { omit } from 'lodash'
import { SERVER_STATUS_CODE } from '~/constants/statuses'
import { ErrorWithStatus, ProductCartErrors } from '~/models/Errors'

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  try {
    if (err instanceof ErrorWithStatus) {
      return res.status(err.status_code).json(omit(err, ['status_code']))
    }

    if (err instanceof ProductCartErrors) {
      return res.status(SERVER_STATUS_CODE.BAD_REQUEST).json(
        err.errors.map((e) => {
          return omit(e, ['status_code'])
        })
      )
    }
    const finalError: any = {}
    Object.getOwnPropertyNames(err).forEach((key) => {
      if (
        !Object.getOwnPropertyDescriptor(err, key)?.configurable ||
        !Object.getOwnPropertyDescriptor(err, key)?.writable
      ) {
        return
      }
      finalError[key] = err[key]
    })
    return res.status(SERVER_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      message: finalError.message,
      errorInfo: omit(finalError, ['stack'])
    })
  } catch (error) {
    return res.status(SERVER_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      message: 'Internal server error',
      errorInfo: omit(error as any, ['stack'])
    })
  }
}
