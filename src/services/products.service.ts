import { ProductStatus, Role } from '~/constants/enums'
import databaseService from './database.service'
import { Product } from '~/models/schemas/products.schema'
import { ObjectId } from 'mongodb'
import { CartProduct } from '~/models/schemas/orders.schema'

class ProductService {
  async getProducts(role: Role, limit: number, page: number) {
    if (role === Role.Staff) {
      const result = await databaseService.products
        .find(
          {
            status: ProductStatus.Available
          },
          {
            projection: {
              import_price: 0
            }
          }
        )
        .skip(limit * (page - 1))
        .limit(limit)
        .toArray()
      return result
    }
    const result = await databaseService.products
      .find({ status: ProductStatus.Available })
      .skip(limit * (page - 1))
      .limit(limit)
      .toArray()
    return result
  }

  async addProduct(product: Product) {
    const result = await databaseService.products.insertOne(product)
    return result
  }

  async getProductById(product_id: string, role?: Role) {
    if (role === Role.Manager) {
      const product = await databaseService.products.findOne({ _id: new ObjectId(product_id) })
      return product
    }
    return await databaseService.products.findOne(
      { _id: new ObjectId(product_id), status: ProductStatus.Available },
      { projection: { import_price: 0 } }
    )
  }

  async purchaseProducts(cartProductList: CartProduct[]) {
    const result = await Promise.all(
      cartProductList.map(async (cartProduct) => {
        const product = await databaseService.products.findOneAndUpdate(
          { _id: cartProduct.product_id },
          {
            $inc: { quantity: -cartProduct.quantity },
            $currentDate: {
              updated_at: true
            }
          },
          { returnDocument: 'after' }
        )
        if (product?.quantity == 0) {
          await databaseService.products.updateOne(
            { _id: new ObjectId(cartProduct.product_id) },
            {
              $set: {
                status: ProductStatus.SoldOut
              },
              $currentDate: {
                updated_at: true
              }
            }
          )
        }
      })
    )
    return result
  }

  async deleteProduct(product_id: string) {
    const result = await databaseService.products.updateOne(
      { _id: new ObjectId(product_id) },
      {
        $set: {
          status: ProductStatus.Deleted
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    return result
  }
}

export const productService = new ProductService()
