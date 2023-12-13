import { ObjectId } from 'mongodb'
import { PaymentMethod, PaymentStatus } from '~/constants/enums'
type CartProductType = {
  product_id: ObjectId
  product_name: string
  price: number
  quantity: number
}

export class CartProduct {
  product_id: ObjectId
  product_name: string
  price: number
  quantity: number
  sub_total: number
  constructor(cartProduct: CartProductType) {
    this.product_id = cartProduct.product_id
    this.product_name = cartProduct.product_name
    this.price = cartProduct.price
    this.quantity = cartProduct.quantity
    this.sub_total = this.getSubTotal()
  }
  getSubTotal = () => {
    return this.quantity * this.price
  }
}

type OrderType = {
  _id?: ObjectId
  customer: ObjectId
  product_list: CartProduct[]
  voucher?: string
  total_order?: number //chưa tính thuế & giảm giá từ voucher.
  total_bill: number
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  created_at?: Date
  created_by: ObjectId
  updated_at?: Date
}

export class Order {
  _id: ObjectId
  customer: ObjectId
  product_list: CartProduct[]
  voucher: string
  total_order: number
  total_bill: number
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  created_at: Date
  created_by: ObjectId
  updated_at: Date

  constructor(order: OrderType) {
    const today = new Date()
    this._id = order._id || new ObjectId()
    this.customer = order.customer
    this.product_list = order.product_list
    this.voucher = order.voucher || ''
    this.payment_method = order.payment_method
    this.payment_status = order.payment_status
    this.total_order = this.getTotalOrder()
    this.total_bill = order.total_bill
    this.created_at = order.created_at || today
    this.updated_at = order.updated_at || today
    this.created_by = order.created_by
  }
  getTotalOrder() {
    return this.product_list.reduce((sum, product) => sum + product.sub_total, 0)
  }
}
