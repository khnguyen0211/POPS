import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ProductStatus } from '~/constants/enums'
import { SERVER_MESSAGES } from '~/constants/messages'
import { SERVER_STATUS_CODE } from '~/constants/statuses'
import { ErrorWithStatus } from '~/models/Errors'
import { UpdateProductReqBody } from '~/models/requests/payments.requests'
import { TokenPayload } from '~/models/requests/users.requests'
import { Product } from '~/models/schemas/products.schema'
import { fileService } from '~/services/files.service'
import { productService } from '~/services/products.service'
export const getProductsController = async (req: Request, res: Response, next: NextFunction) => {
  const { role } = req.decoded_authorization as TokenPayload
  const { limit, page } = req.body
  const result = await productService.getProducts(role, Number(limit ? limit : ''), Number(page ? page : 0))
  return res.status(200).json(result)
}

export const addProductController = async (req: Request, res: Response, next: NextFunction) => {
  const { product_name, description, brand, import_price, desired_profit, category, quantity, barcode, image_urls } =
    req.body

  const product = new Product({
    product_name,
    description,
    brand,
    import_price,
    retail_price: import_price + import_price * desired_profit,
    category,
    quantity,
    barcode,
    image_urls,
    status: ProductStatus.Available
  })

  const result = await productService.addProduct(product)
  return res.status(SERVER_STATUS_CODE.CREATED).json({ mess: 'Add product successfully', result })
}

export const uploadProductImageController = async (req: Request, res: Response, next: NextFunction) => {
  const url_list = await fileService.compressProductImgFile(req)
  const urls = url_list.map((url) => {
    return url
  })
  const result = { message: SERVER_MESSAGES.UPLOAD_PRODUCT_IMAGES_SUCCESSFULLY, urls }
  return res.status(200).json(result)
}

export const getProductDetailController = async (req: Request, res: Response, next: NextFunction) => {
  const { product_id } = req.params
  const { role } = req.decoded_authorization as TokenPayload
  const product = await productService.getProductById(product_id, role)
  res.json(product)
}

export const deleteProductController = async (req: Request, res: Response, next: NextFunction) => {
  const { product_id } = req.params
  if (!product_id || product_id.length != 24) {
    return res.status(SERVER_STATUS_CODE.UNPROCESSABLE_ENTITY).json({ message: 'Product ID must be 24 characters' })
  }
  const result = await productService.deleteProduct(product_id)
  if (result.matchedCount === 0 || result.acknowledged == false) {
    return res.json({ message: 'Cannot delete this product' })
  }
  return res.status(SERVER_STATUS_CODE.OK).json({ message: 'Delete product successfully' })
}
//Request<ParamsDictionary, any, LoginReqBody>
export const updateProductController = async (
  req: Request<ParamsDictionary, any, UpdateProductReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { product_id } = req.params
  if (!product_id || product_id.length != 24) {
    throw new ErrorWithStatus({
      message: 'Product id is required',
      status_code: SERVER_STATUS_CODE.UNPROCESSABLE_ENTITY
    })
  }

  const { body } = req
  const result = await productService.updateProduct(product_id, body)
  return res.json(result)
}
