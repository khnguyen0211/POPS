import { Product } from '~/models/schemas/products.schema'
import databaseService from './database.service'
import { Customer } from '~/models/schemas/customers.schema'

class SearchService {
  async findProduct(text: string) {
    const product = await databaseService.products
      .aggregate<Product>([
        {
          $match: {
            $text: {
              $search: text
            }
          }
        }
      ])
      .toArray()
    return product
  }

  async findCustomer(text: string) {
    const customer = await databaseService.customers
      .aggregate<Customer>([
        {
          $match: {
            $text: {
              $search: text
            }
          }
        }
      ])
      .toArray()
    return customer
  }
}

export const searchService = new SearchService()
