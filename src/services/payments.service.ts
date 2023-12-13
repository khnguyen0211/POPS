import { ObjectId } from 'mongodb'
import databaseService from './database.service'
import { PaymentStatus, matchQuery } from '~/constants/enums'
import { Order } from '~/models/schemas/orders.schema'
import { Invoice } from '~/models/schemas/invoice.schema'
import { Customer } from '~/models/schemas/customers.schema'

class PaymentService {
  async getVoucherByCode(code: string) {
    const voucher = await databaseService.vouchers.findOne({ code })
    if (voucher && voucher.isUsed === false && new Date().getTime() <= voucher.expire_at.getTime()) {
      return voucher
    }
    return null
  }

  async useVoucher(code: string) {
    const result_updated = await databaseService.vouchers.updateOne(
      {
        code
      },
      {
        $set: {
          isUsed: true
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    return result_updated
  }

  async changeStatus({ order_id, payment_status }: { order_id: string; payment_status: PaymentStatus }) {
    const bill = await databaseService.orders.updateOne({ _id: new ObjectId(order_id) }, { $set: { payment_status } })
    return bill
  }

  async getRevenue({ days, user_id, customer_id }: { days: string[]; user_id?: string; customer_id?: string }) {
    const revenue_list = await Promise.all(
      days.map(async (day) => {
        const gte_day = new Date(`${day}T00:00:00.000Z`)
        const lt_day = new Date(`${day}T23:59:59.999Z`)
        const match_query: matchQuery = {
          created_at: {
            $gte: gte_day,
            $lte: lt_day
          }
        }
        if (user_id) {
          match_query['created_by._id'] = new ObjectId(user_id)
        }
        if (customer_id) {
          match_query['customer._id'] = new ObjectId(customer_id)
        }
        const order_list = await databaseService.invoices
          .aggregate<Invoice>([
            {
              $match: match_query
            }
          ])
          .toArray()
        const total_each_day = order_list.reduce((sum, order) => sum + order.subtotal, 0)
        const total_order = order_list.length
        const total_product = order_list.reduce(
          (sum, order) =>
            sum +
            order.product_list.reduce((total_quantity, cart_product) => total_quantity + cart_product.quantity, 0),
          0
        )

        return { total_each_day, total_order, total_product }
      })
    )
    return revenue_list
  }

  async getOrderList({ days, user_id, customer_id }: { days: string[]; user_id?: string; customer_id?: string }) {
    const orderList = await Promise.all(
      days.map(async (day) => {
        const gte_day = new Date(`${day}T00:00:00.000Z`)
        const lt_day = new Date(`${day}T23:59:59.999Z`)
        const match_query: matchQuery = {
          created_at: {
            $gte: gte_day,
            $lte: lt_day
          }
        }
        if (user_id) {
          match_query['created_by._id'] = new ObjectId(user_id)
        }
        if (customer_id) {
          match_query['customer._id'] = new ObjectId(customer_id)
        }
        const orders = await databaseService.invoices
          .find(match_query, {
            projection: {
              product_list: 0,
              VAT: 0,
              'customer.phone_number': 0,
              'customer.address': 0,
              'created_by.email': 0,
              'created_by.username': 0,
              'created_by.password': 0,
              'created_by.verify_token': 0,
              'created_by.role': 0,
              'created_by.avatar_url': 0,
              'created_by.status': 0,
              'created_by.created_at': 0,
              'created_by.updated_at': 0,
              'created_by.inserted_by': 0
            },
            sort: {
              created_at: -1
            }
          })
          .toArray()

        return orders
      })
    )
    return orderList
  }
}

export const paymentService = new PaymentService()
