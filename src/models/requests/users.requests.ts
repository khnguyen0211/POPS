import { JwtPayload } from 'jsonwebtoken'
import { TokenType, UserStatus, Role } from '~/constants/enums'

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
  status: UserStatus
  role: Role
  iat: number
  exp: number
}
