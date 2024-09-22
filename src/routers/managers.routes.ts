import { Router } from 'express'
import { Role, UserStatus } from '~/constants/enums'
import {
  createAccountController,
  getStaffInfoController,
  getStaffListController,
  lockAccountController,
  resendEmailVerifyController,
  unlockAccountController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  createAccountValidator,
  emailValidator,
  lockedStatusValidator,
  managerRoleValidator,
  unlockedStatusValidator
} from '~/middlewares/users.middlewares'
import { User } from '~/models/schemas/users.schema'
import databaseService from '~/services/database.service'
import { hashPassword } from '~/utils/crypto'
import { wrapSync } from '~/utils/wrapAsync'
const managerRouters = Router()

managerRouters.post('/add-manager', async (req, res) => {
  const email = 'admin@gmail.com'
  const username = email.split('@')[0]
  await databaseService.users.insertOne(
    new User({
      full_name: 'The Manager',
      email,
      password: hashPassword(username),
      role: Role.Manager,
      status: UserStatus.Verified
    })
  )
  res.json('add admin user successfully')
})

managerRouters.post(
  '/create-staff-account',
  accessTokenValidator,
  managerRoleValidator,
  createAccountValidator,
  wrapSync(createAccountController)
)

managerRouters.post(
  '/resend-email-verify',
  accessTokenValidator,
  managerRoleValidator,
  emailValidator,
  wrapSync(resendEmailVerifyController)
)
//managerRoleValidator
managerRouters.get('/staff-list', accessTokenValidator, wrapSync(getStaffListController))

managerRouters.get(
  '/staff-info/:staff_id',
  // accessTokenValidator,
  // managerRoleValidator,
  wrapSync(getStaffInfoController)
)

managerRouters.post(
  '/lock-account',
  accessTokenValidator,
  managerRoleValidator,
  lockedStatusValidator,
  wrapSync(lockAccountController)
)

managerRouters.post(
  '/unlock-account',
  accessTokenValidator,
  managerRoleValidator,
  unlockedStatusValidator,
  wrapSync(unlockAccountController)
)

export default managerRouters
