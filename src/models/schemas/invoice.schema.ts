import { ObjectId } from 'mongodb'
import { Customer } from './customers.schema'
import { User } from './users.schema'

export class ProductInvoice {
  product_id: ObjectId
  product_name: string
  quantity: number
  price: number
  constructor({
    product_id,
    product_name,
    quantity,
    price
  }: {
    product_id: ObjectId
    product_name: string
    quantity: number
    price: number
  }) {
    this.product_id = product_id
    this.product_name = product_name
    this.quantity = quantity
    this.price = price
  }
}
type InvoiceType = {
  _id?: ObjectId
  invoice_code: string
  customer: Customer
  product_list: ProductInvoice[]
  subtotal: number
  discount: number
  total: number
  payment_method: string
  money_given?: number
  money_back?: number
  created_at?: Date
  created_by: User
}
export class Invoice {
  _id: ObjectId
  invoice_code: string
  customer: Customer
  product_list: ProductInvoice[]
  subtotal: number
  discount: number
  VAT: string
  total: number
  payment_method: string
  money_given: number
  money_back: number
  created_at: Date
  created_by: User

  constructor(invoice: InvoiceType) {
    this._id = invoice._id || new ObjectId()
    this.invoice_code = invoice.invoice_code
    this.customer = invoice.customer
    this.product_list = invoice.product_list
    this.subtotal = invoice.subtotal
    this.discount = invoice.discount
    this.VAT = '10%'
    this.total = invoice.total
    this.payment_method = invoice.payment_method
    this.money_given = invoice.money_given || 0
    this.money_back = invoice.money_back || this.getMoneyBack()
    this.created_at = invoice.created_at || new Date()
    this.created_by = invoice.created_by
  }

  getMoneyBack() {
    if (this.money_given) {
      return Math.floor(this.money_given - this.total)
    }
    return 0
  }
}
