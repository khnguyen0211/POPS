import { Server } from 'socket.io'
import { ObjectId } from 'mongodb'
import Conversation from '~/models/schemas/conversations.schema'
import databaseService from '~/services/database.service'
import { Server as ServerHttp } from 'http'
import { TokenPayload } from '~/models/requests/users.requests'
import { verifyToken } from './jwt'
import { UserStatus } from '~/constants/enums'
import { ErrorWithStatus } from '~/models/Errors'
import { SERVER_MESSAGES } from '~/constants/messages'
import { SERVER_STATUS_CODE } from '~/constants/statuses'
import { env_config } from '~/constants/config'

export const initialSocket = (httpServer: ServerHttp) => {
  const io = new Server(httpServer, {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3001']
    }
  })

  const users: {
    [key: string]: {
      socket_id: string
    }
  } = {}

  io.use(async (socket, next) => {
    const { Authorization } = socket.handshake.auth
    const access_token = Authorization?.split(' ')[1]
    try {
      const decoded_authorization = await verifyToken({
        token: access_token,
        secretKey: env_config.jwt_access_token_secret_key
      })
      const { status } = decoded_authorization as TokenPayload
      if (status !== UserStatus.Verified) {
        throw new ErrorWithStatus({
          message: SERVER_MESSAGES.USER_NOT_VERIFIED,
          status_code: SERVER_STATUS_CODE.FORBIDDEN
        })
      }
      socket.handshake.auth.decoded_authorization = decoded_authorization
      socket.handshake.auth.access_token = access_token
      return next()
    } catch (error) {
      next({
        message: 'Unauthorized',
        name: 'UnauthorizedError',
        data: error
      })
    }
  })

  io.on('connection', (socket) => {
    const { user_id } = socket.handshake.auth.decoded_authorization as TokenPayload
    users[user_id] = {
      socket_id: socket.id
    }
    console.log(`${users[user_id]} is connected`)
    socket.use(async (packet, next) => {
      const { access_token } = socket.handshake.auth
      try {
        const decoded_authorization = await verifyToken({
          token: access_token,
          secretKey: env_config.jwt_access_token_secret_key
        })
        return next()
      } catch (error) {
        next(new Error('Unauthorized'))
      }
    })

    socket.on('error', (error) => {
      if (error.message === 'Unauthorized') {
        socket.disconnect()
      }
    })

    socket.emit('status_online')

    socket.on('send_message', async (data) => {
      const { from, content, to } = data
      const conversation = new Conversation({
        sender_id: new ObjectId(from),
        receiver_id: new ObjectId(to),
        content: content
      })
      await databaseService.conversations.insertOne(conversation)

      if (users[data.to]) {
        const receiver_socket_id = users[data.to].socket_id
        socket.to(receiver_socket_id).emit('receive_message', conversation)
      }
    })

    socket.on('video_call_request', async (data) => {
      const { from, content, to } = data
      const conversation = new Conversation({
        sender_id: new ObjectId(from),
        receiver_id: new ObjectId(to),
        content: content
      })
      await databaseService.conversations.insertOne(conversation)

      if (users[data.to]) {
        const receiver_socket_id = users[data.to].socket_id
        socket.to(receiver_socket_id).emit('user_calling', conversation)
      } else {
        socket.emit('user_offline', conversation)
      }
    })

    socket.on('video_call_accepted', (data) => {
      socket.to(users[data.to].socket_id).emit('video_calling', data)
    })

    socket.on('sender_is_calling', (data) => {
      socket.to(users[data.from].socket_id).emit('receiver_is_calling', data)
    })

    socket.on('check_friend_list_status', (listId: string[]) => {
      const result = listId.map((id) => {
        if (users[id]) {
          return { id, status: 'Online' }
        }
        return { id, status: 'Offline' }
      })
      socket.emit('result_status_friends_list', result)
    })
    socket.on('disconnect', () => {
      console.log(`${user_id} is disconnected`)
      delete users[user_id]
    })
  })
}
