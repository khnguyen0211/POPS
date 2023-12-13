import { Router } from 'express'
import {
  getDiscountByVoucherController,
  payByCashController,
  payByPaypalController,
  paymentFailedController,
  paymentSuccessController
} from '~/controllers/payments.controllers'
import { paymentValidator } from '~/middlewares/payments.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapSync } from '~/utils/wrapAsync'
const paymentRouters = Router()

//Incomplete validation
// paymentRouters.post('/create-cart', accessTokenValidator, wrapSync(createCartController))

paymentRouters.post('/get-discount-by-voucher', wrapSync(getDiscountByVoucherController))
paymentRouters.post('/pay-by-cash', accessTokenValidator, paymentValidator, wrapSync(payByCashController))
paymentRouters.post('/pay-by-paypal', accessTokenValidator, paymentValidator, wrapSync(payByPaypalController))
paymentRouters.post('/paypal-success', wrapSync(paymentSuccessController))
paymentRouters.post('/paypal-failed', wrapSync(paymentFailedController))
paymentRouters.post('/get-discount-by-voucher', wrapSync(getDiscountByVoucherController))

export default paymentRouters
