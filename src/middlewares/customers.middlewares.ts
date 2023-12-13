import { checkSchema } from 'express-validator'
import { SERVER_MESSAGES } from '~/constants/messages'
import { SERVER_STATUS_CODE } from '~/constants/statuses'
import { ErrorWithStatus } from '~/models/Errors'
import { customerService } from '~/services/customers.service'
import { validate } from '~/utils/validation'

export const customerValidator = validate(
  checkSchema(
    {
      customer_name: {
        notEmpty: {
          errorMessage: 'Customer name is required'
        }
      },
      phone_number: {
        notEmpty: {
          errorMessage: 'Phone number is required'
        },
        isString: true,

        custom: {
          options: async (value: string) => {
            if (value.length === 10 && value.charAt(0) === '0') {
              const customer = await customerService.getCustomerByPhoneNumber(value)
              if (customer) {
                throw new ErrorWithStatus({
                  message: SERVER_MESSAGES.PHONE_NUMBER_ALREADY_EXISTS,
                  status_code: SERVER_STATUS_CODE.CONFLICT
                })
              }
              return true
            }

            throw new ErrorWithStatus({
              message: SERVER_MESSAGES.PHONE_NUMBER_IS_INVALID,
              status_code: SERVER_STATUS_CODE.BAD_REQUEST
            })
          }
        }
      },
      address: {
        notEmpty: {
          errorMessage: 'Address is required'
        }
      }
    },
    ['body']
  )
)
