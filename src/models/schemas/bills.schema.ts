import { ObjectId } from 'mongodb'
import { PaymentMethod, PaymentStatus } from '~/constants/enums'
import { CartProduct } from './orders.schema'

type BillType = {
  _id?: ObjectId
  bill_code?: string
  customer: ObjectId
  product_list: CartProduct[]
  discount?: number
  tax?: number
  sub_total?: number
  total?: number
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  money_given?: number
  money_back?: number
  created_at?: Date
  created_by: ObjectId
  updated_at?: Date
}

export class Bill {
  _id: ObjectId
  bill_code: string
  customer: ObjectId
  product_list: CartProduct[]
  discount: number
  tax: number
  sub_total: number
  total: number
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  money_given: number
  money_back: number
  created_at: Date
  created_by: ObjectId
  updated_at: Date

  constructor(bill: BillType) {
    const today = new Date()

    this._id = bill._id || new ObjectId()
    this.bill_code = bill.bill_code || ''
    this.customer = bill.customer
    this.product_list = bill.product_list
    this.discount = bill.discount || 0
    this.tax = (bill.tax != 0 ? bill.tax : 0.005) || 0.05
    this.sub_total = bill.sub_total || this.getSubtotal()
    this.total = bill.total || this.getTotal()
    this.payment_method = bill.payment_method
    this.payment_status = bill.payment_status
    this.money_given = bill.money_given || 0
    this.money_back = bill.money_back || this.getMoneyBack()
    this.created_at = bill.created_at || today
    this.updated_at = bill.updated_at || today
    this.created_by = bill.created_by
  }

  getTotal() {
    return this.sub_total + this.sub_total * this.tax - this.discount
  }

  getSubtotal() {
    return this.product_list.reduce((sum, product) => sum + product.sub_total, 0)
  }

  getMoneyBack() {
    if (this.money_given) {
      return this.money_given - this.getTotal()
    }
    return 0
  }
}
