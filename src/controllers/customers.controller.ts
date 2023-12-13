import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { SERVER_MESSAGES } from '~/constants/messages'
import { SERVER_STATUS_CODE } from '~/constants/statuses'
import { ErrorWithStatus } from '~/models/Errors'
import { Customer } from '~/models/schemas/customers.schema'
import { customerService } from '~/services/customers.service'
import databaseService from '~/services/database.service'
import { paymentService } from '~/services/payments.service'
import { generate_week } from '~/utils/generate_data'

export const addCustomerController = async (req: Request, res: Response) => {
  const { full_name, phone_number, address } = req.body
  const customer = new Customer({ full_name, phone_number, address })
  const result = await customerService.addCustomer(customer)
  res.json(result)
}

export const getCustomerListController = async (req: Request, res: Response) => {
  const customer_list = await customerService.getCustomerList()
  if (customer_list && customer_list.length != 0) {
    return res.status(SERVER_STATUS_CODE.OK).json(customer_list)
  }
  return res.status(SERVER_STATUS_CODE.NOT_FOUND).json({ message: 'Customer list is empty !' })
}

export const searchCustomerController = async (req: Request, res: Response) => {
  const { text } = req.body
  const customer = await customerService.searchCustomerByText(text as string)
  return res.json(customer)
}

export const getDetailCustomerController = async (req: Request, res: Response) => {
  const { customer_id } = req.params
  if (!customer_id) {
    return res.status(404).json('customer_id is required')
  }
  const [customer, revenues, orderList] = await Promise.all([
    databaseService.customers.findOne({ _id: new ObjectId(customer_id) }),
    paymentService.getRevenue({ days: generate_week(true), customer_id }),
    paymentService.getOrderList({ days: generate_week(), customer_id })
  ])
  const revenue_list: number[] = []
  const total_order_list: number[] = []
  const product_quantity_list: number[] = []
  revenues.forEach((obj) => {
    revenue_list.push(obj.total_each_day)
    total_order_list.push(obj.total_order)
    product_quantity_list.push(obj.total_product)
  })
  return res.status(SERVER_STATUS_CODE.OK).json({
    message: SERVER_MESSAGES.GET_STAFF_INFO_SUCCESS,
    customer,
    days: generate_week(true),
    revenue_list,
    total_order_list,
    product_quantity_list,
    orderList
  })
}
