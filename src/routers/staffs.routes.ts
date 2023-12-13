import { Router } from 'express'
import { createPasswordController, verifyTokenController } from '~/controllers/users.controllers'
import { accessTokenValidator, createPasswordValidator, verifyTokenValidator } from '~/middlewares/users.middlewares'
import { wrapSync } from '~/utils/wrapAsync'

const staffRouters = Router()

//click on the link in email
staffRouters.post('/check-verify-token', verifyTokenValidator, wrapSync(verifyTokenController))
staffRouters.post('/create-password', accessTokenValidator, createPasswordValidator, wrapSync(createPasswordController))

export default staffRouters
