export type CartProductReq = {
  product_id: string
  quantity: number
}

export type AddToCartReqBody = {
  customer_id: string
  product_list: CartProductReq[]
  tax?: number
}

export type PayByCashReqBody = {
  customer_id: string
  product_list: CartProductReq[]
  voucher?: string
  tax?: string
  payment_method: number
  money_given: number
}

export type UpdateProductReqBody = {
  product_name?: string
  description?: string
  brand?: number
  import_price?: number
  retail_price?: number
  category?: number
  image_urls?: string[]
  barcode?: string
  quantity?: number
  status?: number
}
