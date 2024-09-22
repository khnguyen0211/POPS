import { Router } from 'express'
import {
  addCustomerController,
  getCustomerListController,
  searchCustomerController,
  getDetailCustomerController
} from '~/controllers/customers.controller'
import { customerValidator } from '~/middlewares/customers.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapSync } from '~/utils/wrapAsync'

const customerRouters = Router()
customerRouters.post('/add-customer', accessTokenValidator, customerValidator, wrapSync(addCustomerController))
customerRouters.get('/customer-list', wrapSync(getCustomerListController))
customerRouters.get('/search-customer', wrapSync(searchCustomerController))
customerRouters.get('/detail/:customer_id', accessTokenValidator, wrapSync(getDetailCustomerController))

export default customerRouters
