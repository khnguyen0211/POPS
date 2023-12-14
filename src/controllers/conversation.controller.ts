import { Request, Response } from 'express'
import { TokenPayload } from '~/models/requests/users.requests'
import { conversationService } from '~/services/conversations.service'

export const getConversationController = async (req: Request, res: Response) => {
  const { receiver_id } = req.params
  const sender_id = req.decoded_authorization?.user_id as string
  const conversation = await conversationService.getConversation({ sender_id, receiver_id })
  return res.json(conversation)
}

export const getRecentlyFriendsController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const friend_list = await conversationService.getRecentlyFriends(user_id)
  return res.status(200).json(friend_list)
}
