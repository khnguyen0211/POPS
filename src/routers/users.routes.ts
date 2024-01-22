import axios from 'axios'
import { Router, json } from 'express'
import { ObjectId } from 'mongodb'
import { env_config } from '~/constants/config'
import { SERVER_STATUS_CODE } from '~/constants/statuses'
import {
  changePasswordController,
  getMyProfileController,
  loginController,
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
import { userService } from '~/services/users.service'
import { wrapSync } from '~/utils/wrapAsync'

const userRouters = Router()

userRouters.post('/login', loginValidator, userVerifyValidator, wrapSync(loginController))
userRouters.post('/logout', accessTokenValidator, refreshTokenValidator, wrapSync(logoutController))
userRouters.post('/my-profile', accessTokenValidator, wrapSync(getMyProfileController))
userRouters.post('/change-password', accessTokenValidator, changePasswordValidator, wrapSync(changePasswordController))
userRouters.post('/upload-avatar', accessTokenValidator, wrapSync(uploadAvatarController))
userRouters.post('/refresh-token', accessTokenValidator, refreshTokenValidator, wrapSync(refreshTokenController))
userRouters.get('/oauth/google', async (req, res) => {
  const { code } = req.query
  const data = await getOAuthGoogleToken(code as string) // Gửi authorization code để lấy Google OAuth token
  const { id_token, access_token } = data // Lấy ID token và access token từ kết quả trả về
  const googleUser = await getGoogleUser({ id_token, access_token }) // Gửi Google OAuth token để lấy thông tin người dùng từ Google
  const { email } = googleUser
  const user = await databaseService.users.findOne({ email })
  if (!user) {
    return res.status(SERVER_STATUS_CODE.NOT_FOUND).json('Google account not found')
  }
  if (user.status != 1) {
    return res.status(SERVER_STATUS_CODE.FORBIDDEN).json('Your account is not allowed')
  }
  const user_id = user._id.toString()
  const status = user.status
  const role = user.role
  const tokens = await userService.login({ user_id, status, role })
  const result = {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    avatar: googleUser.picture
  }
  const queryString = new URLSearchParams(result).toString()
  const url = `https://pops.onrender.com/?${queryString}`
  return res.redirect(url)
})
userRouters.get('/get-friend/:id', async (req, res, next) => {
  const { id } = req.params
  const user = await databaseService.users.findOne(
    { _id: new ObjectId(id) },
    {
      projection: {
        password: 0,
        username: 0,
        verify_token: 0,
        created_at: 0,
        updated_at: 0,
        inserted_by: 0
      }
    }
  )
  return res.status(200).json(user)
})
const getGoogleUser = async ({ id_token, access_token }: { id_token: string; access_token: string }) => {
  const { data } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
    params: {
      access_token,
      alt: 'json'
    },
    headers: {
      Authorization: `Bearer ${id_token}`
    }
  })
  return data
}

const getOAuthGoogleToken = async (code: string) => {
  if (!code) {
    return 0
  }
  const body = {
    code,
    client_id: '851921911617-n07b8va3mj79k1i4du5eo9t8nkt1mgcp.apps.googleusercontent.com',
    client_secret: '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',
    redirect_uri: `${env_config.host}:${env_config.port}/users/oauth/google`,
    grant_type: 'authorization_code'
  }
  const { data } = await axios.post('https://oauth2.googleapis.com/token', body, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  return data
}
export default userRouters
