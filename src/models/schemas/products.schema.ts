import { ObjectId } from 'mongodb'
import { Brand, Category, ProductStatus } from '~/constants/enums'

type ProductType = {
  _id?: ObjectId
  product_name: string
  description?: string
  brand?: Brand
  import_price: number
  retail_price: number
  category: Category
  image_urls?: string[]
  barcode?: string
  quantity: number
  status: ProductStatus
  created_at?: Date
  updated_at?: Date
}

export class Product {
  _id: ObjectId
  product_name: string
  description: string
  brand: Brand
  import_price: number
  retail_price: number
  category: Category
  image_urls: string[]
  barcode: string
  quantity: number
  status: ProductStatus
  created_at: Date
  updated_at: Date
  constructor(product: ProductType) {
    const today = new Date()
    this._id = product._id || new ObjectId()
    this.product_name = product.product_name
    this.description = product.description || ''
    this.brand = product.brand || Brand.Unknown
    this.import_price = product.import_price
    this.retail_price = product.retail_price
    this.category = product.category
    this.barcode = product.barcode || ''
    this.image_urls = product.image_urls || ['']
    this.quantity = product.quantity
    this.status = product.status
    this.created_at = product.created_at || today
    this.updated_at = product.updated_at || today
  }
}
