import { Router } from 'express'
import { searchService } from '~/services/search.service'

const searchRouters = Router()

searchRouters.post('/product-searching', async (req, res) => {
  const { text } = req.body
  const product = await searchService.findProduct(text)
  return res.json(product)
})

searchRouters.post('/customer-searching', async (req, res) => {
  const { text } = req.body
  const customer = await searchService.findCustomer(text)
  return res.json(customer)
})
export default searchRouters
