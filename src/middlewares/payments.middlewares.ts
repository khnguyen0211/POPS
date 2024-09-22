import { Request } from 'express'
import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { ProductStatus } from '~/constants/enums'
import { SERVER_STATUS_CODE } from '~/constants/statuses'
import { ErrorWithStatus, ProductCartErrors } from '~/models/Errors'
import { CartProductReq } from '~/models/requests/payments.requests'
import { CartProduct } from '~/models/schemas/orders.schema'
import { productService } from '~/services/products.service'

import { validate } from '~/utils/validation'

export const paymentValidator = validate(
  checkSchema({
    customer_id: {
      notEmpty: {
        errorMessage: 'Customer ID is required'
      },
      isLength: {
        options: {
          min: 24,
          max: 24
        },
        errorMessage: 'Customer ID is invalid'
      }
    },
    product_list: {
      notEmpty: {
        errorMessage: 'Product list is required'
      },
      custom: {
        options: async (products_req: CartProductReq[], { req }) => {
          const cart_products = await Promise.all(
            products_req.map(async (cartProduct: CartProductReq) => {
              if (cartProduct.product_id.length != 24) {
                return new ErrorWithStatus({
                  message: `Product Id ${cartProduct.product_id} is Invalid`,
                  status_code: SERVER_STATUS_CODE.BAD_REQUEST
                })
              }
              if (cartProduct.quantity <= 0) {
                return new ErrorWithStatus({
                  message: `Quantity of product ${cartProduct.product_id} is Invalid`,
                  status_code: SERVER_STATUS_CODE.BAD_REQUEST
                })
              }
              const product = await productService.getProductById(cartProduct.product_id)
              if (product) {
                if (product.status === ProductStatus.SoldOut) {
                  return new ErrorWithStatus({
                    message: `Product ${product.product_name} already sold out`,
                    status_code: SERVER_STATUS_CODE.BAD_REQUEST
                  })
                }
                //Nếu số lượng nhận vào lớn hơn số lượng trong database => throw lỗi
                if (cartProduct.quantity > product.quantity) {
                  return new ErrorWithStatus({
                    message: `There are only ${product.quantity} item of ${product.product_name} available. Please adjust the quantity in your order`,
                    status_code: SERVER_STATUS_CODE.BAD_REQUEST
                  })
                }
                //nếu tìm thấy sản phẩm & số lượng hợp lệ thì return sản phẩm
                const newCartProduct = new CartProduct({
                  product_id: product?._id as ObjectId,
                  product_name: product?.product_name as string,
                  price: product.retail_price,
                  quantity: cartProduct.quantity
                })

                return newCartProduct
              }
              return new ErrorWithStatus({
                message: `No product found with id: ${cartProduct.product_id}`,
                status_code: SERVER_STATUS_CODE.BAD_REQUEST
              })
            })
          )

          const errors: ErrorWithStatus[] = []

          cart_products.forEach((product) => {
            if (product instanceof ErrorWithStatus) {
              errors.push(product)
            }
          })

          if (errors.length > 0) {
            throw new ProductCartErrors(errors)
          }

          ;(req as Request).cart_products = cart_products as CartProduct[]
          return true
        }
      }
    },
    voucher: {
      optional: true
    },
    tax: {
      optional: true
    },
    money_given: {
      optional: true
    }
  })
)
