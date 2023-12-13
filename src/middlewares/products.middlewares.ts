import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { SERVER_STATUS_CODE } from '~/constants/statuses'
import { EntityError, ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.service'
import { validate } from '~/utils/validation'

export const productValidator = validate(
  checkSchema({
    product_name: {
      notEmpty: {
        errorMessage: 'Product_name is required'
      },
      isLength: {
        options: {
          max: 100
        }
      }
    },
    description: {
      optional: true
    },
    brand: {
      notEmpty: {
        errorMessage: 'Brand is required'
      }
    },
    import_price: {
      notEmpty: {
        errorMessage: 'Import_price is required'
      }
    },
    desired_profit: {
      notEmpty: {
        errorMessage: 'Desired_profit is required'
      },
      custom: {
        options: (value) => {
          if (value < 0 && value > 1) {
            throw new ErrorWithStatus({
              message: 'Profit is invalid',
              status_code: SERVER_STATUS_CODE.FORBIDDEN
            })
          }
          return true
        }
      }
    },
    category: {
      notEmpty: {
        errorMessage: 'Category is required'
      }
    },
    quantity: {
      notEmpty: {
        errorMessage: 'Quantity is required'
      }
    },
    barcode: {
      notEmpty: {
        errorMessage: 'Barcode is required'
      },
      custom: {
        options: async (value: string, { req }) => {
          if (value) {
            if (value.length === 8) {
              const product = await databaseService.products.findOne({ barcode: value })
              if (product) {
                throw new ErrorWithStatus({
                  message: 'Product already exists',
                  status_code: SERVER_STATUS_CODE.CONFLICT
                })
              }
              return true
            }
            throw new ErrorWithStatus({
              message: 'Barcode is invalid. It should be have 8 characters',
              status_code: SERVER_STATUS_CODE.CONFLICT
            })
          }
        }
      }
    },
    image_urls: {
      optional: true
    }
  })
)
export const deleteProductValidator = async (req: Request, res: Response, next: NextFunction) => {
  const { product_id } = req.params
  const invoices = await databaseService.invoices.find({}).toArray()
  invoices.forEach((inv) => {
    inv.product_list.forEach((product) => {
      if (product.product_id.toString() == product_id) {
        return res.status(SERVER_STATUS_CODE.BAD_REQUEST).json({ message: 'Cannot delete product' })
      }
    })
  })
  return next()
}
