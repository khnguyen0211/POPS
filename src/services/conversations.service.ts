import { ObjectId } from 'mongodb'
import databaseService from './database.service'
import { generate_week } from '~/utils/generate_data'
import Conversation from '~/models/schemas/conversations.schema'

class ConversationService {
  async getConversation({ sender_id, receiver_id }: { sender_id: string; receiver_id: string }) {
    const match = {
      $or: [
        {
          sender_id: new ObjectId(sender_id),
          receiver_id: new ObjectId(receiver_id)
        },
        {
          sender_id: new ObjectId(receiver_id),
          receiver_id: new ObjectId(sender_id)
        }
      ]
    }
    const conversation = await databaseService.conversations.find(match).toArray()
    return conversation
  }
  async getRecentlyFriends(user_id: string) {
    const allConversation: Conversation[] = []
    const recentlyConversations: Conversation[] = []
    const friend_id_set: Set<string> = new Set()
    const last_week = generate_week()
    const conversation_of_week = await Promise.all(
      last_week.map(async (day) => {
        const gte_day = new Date(`${day}T00:00:00.000Z`)
        const lte_day = new Date(`${day}T23:59:59.999Z`)
        const match = {
          $or: [
            {
              created_at: {
                $gte: gte_day,
                $lte: lte_day
              },
              sender_id: new ObjectId(user_id)
            },
            {
              created_at: {
                $gte: gte_day,
                $lte: lte_day
              },
              receiver_id: new ObjectId(user_id)
            }
          ]
        }
        const conversations = await databaseService.conversations.find(match).sort({ created_at: -1 }).toArray()
        conversations.map((con) => {
          friend_id_set.add(con.sender_id.toString())
          friend_id_set.add(con.receiver_id.toString())
          allConversation.push(con)
        })
        // console.log(day, conversations)
        return conversations
      })
    )

    console.log(allConversation)
    console.log(friend_id_set.size)
    friend_id_set.delete(user_id)
    allConversation.forEach((con) => {
      if (friend_id_set.size != 0) {
        friend_id_set.forEach((id) => {
          if (
            (user_id == con.sender_id.toString() && id == con.receiver_id.toString()) ||
            (user_id == con.receiver_id.toString() && id == con.sender_id.toString())
          ) {
            friend_id_set.delete(id)
            recentlyConversations.push(con)
          }
        })
      }
    })
    const users = await Promise.all(
      recentlyConversations.map(async (con) => {
        let user
        if (con.sender_id.toString() == user_id) {
          user = await databaseService.users.findOne(
            { _id: con.receiver_id },
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
          return { ...user, message: con.content, time: con.created_at, isSender: true }
        } else {
          user = await databaseService.users.findOne(
            { _id: con.sender_id },
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
          return { ...user, message: con.content, time: con.created_at, isSender: false }
        }
      })
    )
    return users
  }
}

export const conversationService = new ConversationService()
