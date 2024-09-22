import { Router } from 'express'
import { getConversationController, getRecentlyFriendsController } from '~/controllers/conversation.controller'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapSync } from '~/utils/wrapAsync'

const chatRouters = Router()
chatRouters.get('/conversation/:receiver_id', accessTokenValidator, wrapSync(getConversationController))
chatRouters.get('/recently-friends', accessTokenValidator, wrapSync(getRecentlyFriendsController))
export default chatRouters
