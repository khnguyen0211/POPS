import { Router } from 'express'
import {
  addProductController,
  deleteProductController,
  getProductDetailController,
  getProductsController,
  updateProductController,
  uploadProductImageController
} from '~/controllers/products.controllers'
import { deleteProductValidator, productValidator, updateProductValidator } from '~/middlewares/products.middlewares'
import { accessTokenValidator, managerRoleValidator } from '~/middlewares/users.middlewares'
import { wrapSync } from '~/utils/wrapAsync'

const productRouters = Router()
productRouters.get('/product-list', accessTokenValidator, wrapSync(getProductsController))
productRouters.get('/product-detail/:product_id', accessTokenValidator, wrapSync(getProductDetailController))
productRouters.post('/upload-product-image', wrapSync(uploadProductImageController))
productRouters.post(
  '/add-product',
  accessTokenValidator,
  managerRoleValidator,
  productValidator,
  wrapSync(addProductController)
)

productRouters.patch(
  '/update-product/:product_id',
  accessTokenValidator,
  managerRoleValidator,
  updateProductValidator,
  wrapSync(updateProductController)
)
productRouters.delete('/delete-product/:product_id', deleteProductValidator, wrapSync(deleteProductController))
export default productRouters
