import { Router } from 'express'
import path from 'path'
import { UPLOAD_AVATARS_DIR, UPLOAD_PRODUCTS_DIR, UPLOAD_QRS_DIR } from '~/constants/dirs'

const staticRouters = Router()

staticRouters.get('/images/:name', (req, res) => {
  const { name } = req.params
  return res.sendFile(path.resolve(UPLOAD_AVATARS_DIR, name))
})

staticRouters.get('/products/:name', (req, res) => {
  const { name } = req.params
  return res.sendFile(path.resolve(UPLOAD_PRODUCTS_DIR, name))
})

staticRouters.get('/paypal/:name', (req, res) => {
  const { name } = req.params
  return res.sendFile(path.resolve(UPLOAD_QRS_DIR, name))
})
export default staticRouters
