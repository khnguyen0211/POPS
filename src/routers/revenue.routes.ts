import { Router } from 'express'
import { ObjectId } from 'mongodb'
import databaseService from '~/services/database.service'
import { paymentService } from '~/services/payments.service'
import { generate_days, generate_week } from '~/utils/generate_data'

const revenueRouters = Router()

revenueRouters.post('/revenue', async (req, res, next) => {
  const { from, to } = req.body
  let days = []
  if (!from && !to) {
    days = generate_week(true)
  } else {
    days = generate_days(from, to, true)
  }

  const revenues = await paymentService.getRevenue({ days })
  const revenue_list: number[] = []
  const total_order_list: number[] = []
  const product_quantity_list: number[] = []
  revenues.forEach((obj) => {
    revenue_list.push(obj.total_each_day)
    total_order_list.push(obj.total_order)
    product_quantity_list.push(obj.total_product)
  })
  return res.json({ days, revenue_list, total_order_list, product_quantity_list })
})

revenueRouters.post('/order-list', async (req, res, next) => {
  const { from, to } = req.body
  let days = []
  if (!from && !to) {
    days = generate_week()
  } else {
    days = generate_days(from, to)
  }
  const orderList = await paymentService.getOrderList({ days })
  return res.json(orderList)
})

revenueRouters.get('/invoice/:id', async (req, res, next) => {
  const { id } = req.params
  if (!id || id.length != 24) {
    return res.json('order_id is required')
  }
  const invoice = await databaseService.invoices.findOne(
    { _id: new ObjectId(id) },
    {
      projection: {
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
      }
    }
  )
  return res.json(invoice)
})
revenueRouters.get('/revenue-detail', async (req, res, next) => {})

export default revenueRouters
