import { faker } from '@faker-js/faker'
import { ObjectId } from 'mongodb'
import { Gender, Role, UserStatus } from '~/constants/enums'

type UserType = {
  _id?: ObjectId
  full_name: string
  email: string
  password: string
  gender?: Gender
  dob?: Date
  role: Role
  verify_token?: string
  avatar_url?: string
  status?: UserStatus
  created_at?: Date
  updated_at?: Date
  inserted_by?: string
}

export class User {
  _id: ObjectId
  full_name: string
  email: string
  username: string
  password: string
  gender: Gender
  dob: Date
  role: Role
  verify_token: string
  avatar_url: string
  status: UserStatus
  created_at: Date
  updated_at: Date
  inserted_by: string
  constructor(user: UserType) {
    const today = new Date()
    this._id = user._id || new ObjectId()
    this.full_name = user.full_name
    this.email = user.email
    this.username = this.email.split('@')[0]
    this.password = user.password
    this.gender = user.gender || Gender.Male
    this.dob = user.dob || today
    this.role = user.role
    this.verify_token = user.verify_token || ''
    this.avatar_url = user.avatar_url || faker.image.urlPicsumPhotos()
    this.status = user.status || UserStatus.Unverified
    this.created_at = user.created_at || today
    this.updated_at = user.updated_at || today
    this.inserted_by = user.inserted_by || ''
  }
}
