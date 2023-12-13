import { Router } from 'express'
import {
  addProductController,
  deleteProductController,
  getProductDetailController,
  getProductsController,
  uploadProductImageController
} from '~/controllers/products.controllers'
import { deleteProductValidator, productValidator } from '~/middlewares/products.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapSync } from '~/utils/wrapAsync'

const productRouters = Router()
productRouters.get('/product-list', accessTokenValidator, wrapSync(getProductsController))
productRouters.get('/product-detail/:product_id', accessTokenValidator, wrapSync(getProductDetailController))
productRouters.post('/upload-product-image', wrapSync(uploadProductImageController))
productRouters.post('/add-product', productValidator, wrapSync(addProductController))
productRouters.delete('/delete-product/:product_id', deleteProductValidator, wrapSync(deleteProductController))
export default productRouters
