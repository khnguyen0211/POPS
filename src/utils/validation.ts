import { NextFunction, Request, Response } from 'express'
import { validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'
import { SERVER_STATUS_CODE } from '~/constants/statuses'
import { EntityError, ErrorWithStatus, ProductCartErrors } from '~/models/Errors'

export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await validation.run(req)
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }

    const errorsObject = errors.mapped()
    const entityErrors = new EntityError({ errors: {} })
    for (const key in errorsObject) {
      const { msg } = errorsObject[key]

      if (msg instanceof ErrorWithStatus && msg.status_code !== SERVER_STATUS_CODE.UNPROCESSABLE_ENTITY) {
        return next(msg)
      }

      if (msg instanceof ProductCartErrors) {
        return next(msg)
      }

      entityErrors.errors[key] = errorsObject[key]
    }
    return next(entityErrors)
  }
}
