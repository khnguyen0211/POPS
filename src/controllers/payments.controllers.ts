import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { PaymentMethod, PaymentStatus } from '~/constants/enums'
import { SERVER_MESSAGES } from '~/constants/messages'
import { SERVER_STATUS_CODE } from '~/constants/statuses'
import { ErrorWithStatus } from '~/models/Errors'
import { PayByCashReqBody } from '~/models/requests/payments.requests'
import { TokenPayload } from '~/models/requests/users.requests'
import { customerService } from '~/services/customers.service'
import databaseService from '~/services/database.service'
import { paymentService } from '~/services/payments.service'
import { productService } from '~/services/products.service'
import { generateBillCode } from '~/utils/generate_data'
import { Item } from 'paypal-rest-sdk'
import { paypal_util } from '~/utils/paypal'
import { createQR } from '~/utils/generate_QRs'
import { CartProduct, Order } from '~/models/schemas/orders.schema'
import { Invoice, ProductInvoice } from '~/models/schemas/invoice.schema'
import { userService } from '~/services/users.service'
import { Customer } from '~/models/schemas/customers.schema'
import { Voucher } from '~/models/schemas/vouchers.schema'
import { User } from '~/models/schemas/users.schema'
export const payByCashController = async (
  req: Request<ParamsDictionary, any, PayByCashReqBody>,
  res: Response,
<<<<<<< HEAD
  _next: NextFunction
=======
  next: NextFunction
>>>>>>> f638367a30a07ca8ecfe48801352abf454c98f8d
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { customer_id, voucher, money_given } = req.body
  const cartProductList = req.cart_products as CartProduct[]

  let discount = 0
  let voucher_order = ''
  const [user, customer, my_voucher, inv_code] = await Promise.all([
    userService.getStaffInfoById(user_id),
    customerService.getCustomerById(customer_id),
    paymentService.getVoucherByCode(voucher ? voucher : ''),
    generateBillCode()
  ])

  if (!customer) {
    throw new ErrorWithStatus({
      message: SERVER_MESSAGES.NOT_FOUND_CUSTOMER,
      status_code: SERVER_STATUS_CODE.NOT_FOUND
    })
  }

  if (my_voucher) {
    voucher_order = my_voucher.code
    discount = my_voucher.value
  }

  //create order
  const order = new Order({
    customer: customer._id as ObjectId,
    product_list: cartProductList,
    voucher: voucher_order,
    payment_method: PaymentMethod.Cash,
    payment_status: PaymentStatus.Waiting,
    total_bill: 0,
    created_by: new ObjectId(user_id)
  })

  //count total of order (include: subtotal + tax - discount value from voucher)
  const total = order.total_order - discount

  //change total for oder
  order.total_bill = total
  //case failed because money_given < total of order
  if (money_given < total) {
    throw new ErrorWithStatus({
      message: SERVER_MESSAGES.MONEY_GIVEN_IS_LESS_THAN_TOTAL,
      status_code: SERVER_STATUS_CODE.BAD_REQUEST
    })
  }
  //update Success status for order
  order.payment_status = PaymentStatus.Success
  //create product list in invoice
  const invoice_product_list = cartProductList.map((cart_product) => {
    return new ProductInvoice({
      product_id: cart_product.product_id,
      product_name: cart_product.product_name,
      quantity: cart_product.quantity,
      price: cart_product.price
    })
  })
  //create invoice object

  const invoice_id = new ObjectId()
  const invoice = new Invoice({
    _id: invoice_id,
    invoice_code: inv_code,
    customer: customer,
    product_list: invoice_product_list,
    subtotal: order.total_order,
    discount: discount,
    total: total,
    payment_method: 'Cash',
    money_given: money_given,
    created_by: user as User
  })

  //used voucher
  //subtract the quantity of products bought
  const [inserted_invoice, updated_order, use_voucher, updated_products] = await Promise.all([
    databaseService.invoices.insertOne(invoice),
    databaseService.orders.insertOne(order),
    paymentService.useVoucher(voucher_order),
    productService.purchaseProducts(cartProductList)
  ])
  return res.json({ inserted_invoice, updated_order, use_voucher })
}

export const payByPaypalController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { customer_id, voucher } = req.body
  const cartProductList = req.cart_products as CartProduct[]

  let voucher_order = ''
  let discount = 0

  const [user, customer, my_voucher] = await Promise.all([
    userService.getUserById(user_id),
    customerService.getCustomerById(customer_id),
    paymentService.getVoucherByCode(voucher ? voucher : '')
  ])

  if (!customer) {
    throw new ErrorWithStatus({
      message: SERVER_MESSAGES.NOT_FOUND_CUSTOMER,
      status_code: SERVER_STATUS_CODE.NOT_FOUND
    })
  }

  if (my_voucher) {
    voucher_order = voucher
    discount = my_voucher.value
  }
  const order_id = new ObjectId()

  const order = new Order({
    _id: order_id,
    customer: customer._id as ObjectId,
    product_list: cartProductList,
    voucher: voucher_order,
    payment_method: PaymentMethod.Paypal,
    payment_status: PaymentStatus.Waiting,
    total_bill: 0,
    created_by: new ObjectId(user_id)
  })
  //count total of order (include: subtotal + tax - discount value from voucher)
  const total = order.total_order - discount
  //change total for oder
  order.total_bill = total

  await databaseService.orders.insertOne(order)

  const cart_paypal_object: Item[] = cartProductList.map((cartProduct) => {
    return {
      currency: 'USD',
      name: cartProduct.product_name,
      price: cartProduct.price.toString(),
      quantity: cartProduct.quantity
    } as Item
  })

  const result = await paypal_util(cart_paypal_object, order_id.toString(), discount)
  const qr_code = await createQR(result.href)
  return res.json({ qr_code, paypal: result.href })
}

export const getDiscountByVoucherController = async (req: Request, res: Response, next: NextFunction) => {
  const { code } = req.body
  const voucher = await paymentService.getVoucherByCode(code)
  if (voucher) {
    return res.status(SERVER_STATUS_CODE.OK).json({ message: `${voucher.value}` })
  }
  return res.status(SERVER_STATUS_CODE.NOT_FOUND).json({ message: SERVER_MESSAGES.INVALID_VOUCHER })
}

export const paymentSuccessController = async (req: Request, res: Response, next: NextFunction) => {
  const { order_id } = req.body
  const order = (await databaseService.orders.findOne({ _id: new ObjectId(order_id as string) })) as Order
  if (!order) {
    return res.json('Not found order')
  }
  if (order.payment_status !== PaymentStatus.Waiting) {
    return res.json('Order has been paid')
  }
  const invoice_product_list = order.product_list.map((cart_product) => {
    return new ProductInvoice({
      product_id: cart_product.product_id,
      product_name: cart_product.product_name,
      quantity: cart_product.quantity,
      price: cart_product.price
    })
  })
  const [cus, u, vouch, inv_code] = await Promise.all([
    databaseService.customers.findOne({ _id: order?.customer }),
    databaseService.users.findOne({ _id: order.created_by }),
    databaseService.vouchers.findOne({ code: order.voucher }),
    generateBillCode()
  ])
  const customer = cus as Customer
  const user = u as User
  let discount = 0
  let code = ''
  if (vouch) {
    discount = (vouch as Voucher).value
    code = (vouch as Voucher).code
  }

  const invoice = new Invoice({
    invoice_code: inv_code,
    customer: customer,
    product_list: invoice_product_list,
    subtotal: order.total_order,
    discount: discount,
    total: order.total_bill,
    payment_method: 'Paypal',
    money_given: 0,
    money_back: 0,
    created_by: user as User
  })

  const [changed_status, new_invoice] = await Promise.all([
    paymentService.changeStatus({ order_id, payment_status: PaymentStatus.Success }),
    databaseService.invoices.insertOne(invoice),
    paymentService.useVoucher(code)
  ])
  return res.status(200).json({ changed_status, new_invoice })
}

export const paymentFailedController = async (req: Request, res: Response, next: NextFunction) => {
  const { order_id } = req.body
  const order = (await databaseService.orders.findOne({ _id: new ObjectId(order_id as string) })) as Order
  if (!order) {
    return res.json('Not found order')
  }
  if (order.payment_status !== PaymentStatus.Waiting) {
    return res.json('Order has been paid')
  }
  const result = await paymentService.changeStatus({ order_id, payment_status: PaymentStatus.Cancel })
  return res.status(200).json(result)
}
