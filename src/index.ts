import express from 'express'
import databaseService from './services/database.service'
import staffRouters from './routers/staffs.routes'
import managerRouters from './routers/managers.routes'
import userRouters from './routers/users.routes'
import { defaultErrorHandler } from './middlewares/errors.middlewares'
import { initialUploads } from './utils/files_handle'
import staticRouters from './routers/static.routes'
import cors, { CorsOptions } from 'cors'
import { initialData } from './utils/generate_data'
import productRouters from './routers/products.routes'
import paymentRouters from './routers/payments.routes'
import customerRouters from './routers/customer.routes'
import searchRouters from './routers/search.routes'
import revenueRouters from './routers/revenue.routes'
import { createServer } from 'http'
import chatRouters from './routers/conversation.routes'
import { initialSocket } from './utils/socket'
import { env_config } from './constants/config'

const corsOptions: CorsOptions = {
  origin: '*'
}
const app = express()
const httpServer = createServer(app)
app.use(cors(corsOptions))
//app.use(helmet())
databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexProduct()
  databaseService.indexCustomers()
  databaseService.indexRefreshTokens()
  databaseService.indexVouchers()
})
initialUploads()
initialData()

const port = env_config.port
const host = env_config.host

httpServer.listen(port, () => {
  console.log(`POPS is listening on ${host}:${port}`)
})

app.get('/', (req, res) => {
  res.send('Back-end of POPS project')
})
app.use(express.json())
app.use('/users', userRouters)
app.use('/managers', managerRouters)
app.use('/staffs', staffRouters)
app.use('/products', productRouters)
app.use('/static', staticRouters)
app.use('/payments', paymentRouters)
app.use('/customers', customerRouters)
app.use('/search', searchRouters)
app.use('/revenue', revenueRouters)
app.use('/chat', chatRouters)
app.use(defaultErrorHandler)

initialSocket(httpServer)
