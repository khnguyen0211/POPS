import { ObjectId } from 'mongodb'
import databaseService from './database.service'
import { Customer } from '~/models/schemas/customers.schema'

class CustomerService {
  async getCustomerById(customer_id: string) {
    const customer = await databaseService.customers.findOne({ _id: new ObjectId(customer_id) })
    return customer
  }
  async getCustomerByPhoneNumber(phone_number: string) {
    const customer = await databaseService.customers.findOne({ phone_number })
    return customer
  }

  async addCustomer(customer: Customer) {
    const result = await databaseService.customers.insertOne(customer)
    const newCustomer = await databaseService.customers.findOne({ _id: result.insertedId })
    return newCustomer
  }

  async getCustomerList() {
    const customer_list = await databaseService.customers.find({}).toArray()
    return customer_list
  }

  async searchCustomerByText(text?: string) {
    const text_search = text ? text : ''
    const projection = {
      _id: 1,
      full_name: 1,
      address: 1,
      phone_number: 1
    }
    const customer = await databaseService.customers
      .find<Customer[]>({ $text: { $search: text_search } })
      .project(projection)
      .toArray()
    return customer
  }
}

export const customerService = new CustomerService()
