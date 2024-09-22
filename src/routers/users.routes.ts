import { Router } from 'express'
import {
  changePasswordController,
  getFriendByIdController,
  getMyProfileController,
  loginController,
  loginWithGoogleController,
  logoutController,
  refreshTokenController,
  uploadAvatarController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  changePasswordValidator,
  loginValidator,
  refreshTokenValidator,
  userVerifyValidator
} from '~/middlewares/users.middlewares'
import databaseService from '~/services/database.service'
import { wrapSync } from '~/utils/wrapAsync'

const userRouters = Router()

userRouters.post('/login', loginValidator, userVerifyValidator, wrapSync(loginController))
userRouters.post('/logout', accessTokenValidator, refreshTokenValidator, wrapSync(logoutController))
userRouters.post('/my-profile', accessTokenValidator, wrapSync(getMyProfileController))
userRouters.post('/change-password', accessTokenValidator, changePasswordValidator, wrapSync(changePasswordController))
userRouters.post('/upload-avatar', accessTokenValidator, wrapSync(uploadAvatarController))
userRouters.post('/refresh-token', accessTokenValidator, refreshTokenValidator, wrapSync(refreshTokenController))
userRouters.get('/oauth/google', wrapSync(loginWithGoogleController))
userRouters.get('/get-friend/:id', wrapSync(getFriendByIdController))

export default userRouters
