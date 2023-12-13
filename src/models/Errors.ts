import { SERVER_MESSAGES } from '~/constants/messages'
import { SERVER_STATUS_CODE } from '~/constants/statuses'

export class ErrorWithStatus {
  message: string
  status_code: number
  constructor(error: { message: string; status_code: number }) {
    this.message = error.message
    this.status_code = error.status_code
  }
}
export type ErrorsType = Record<
  string,
  {
    msg: string
    [key: string]: any
  }
>

export class EntityError extends ErrorWithStatus {
  errors: ErrorsType
  constructor({ message = SERVER_MESSAGES.VALIDATION_ERROR, errors }: { message?: string; errors: ErrorsType }) {
    super({ message, status_code: SERVER_STATUS_CODE.UNPROCESSABLE_ENTITY })
    this.errors = errors
  }
}

export class ProductCartErrors {
  errors: ErrorWithStatus[]
  constructor(errors: ErrorWithStatus[]) {
    this.errors = errors
  }
}
