import { TokenPayload } from './models/requests/users.requests'
import { CartProduct } from './models/schemas/carts.schema'
import { Customer } from './models/schemas/customers.schema'
import { User } from './models/schemas/users.schema'
import { Voucher } from './models/schemas/vouchers.schema'

declare module 'express' {
  interface Request {
    user?: User
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
    decoded_verify_token?: TokenPayload
    cart_products?: CartProduct[]
  }
}
