import { ObjectId } from 'mongodb'

export enum TokenType {
  AccessToken,
  RefreshToken,
  VerifyToken
}

export enum Action {
  Lock,
  Unlock
}

export enum UserStatus {
  Unverified,
  Verified,
  Blocked
}

export enum Role {
  Staff,
  Manager
}

export enum Gender {
  Male,
  Female
}

export enum Category {
  Phone,
  Laptop,
  Accessories
}
export enum ProductStatus {
  SoldOut,
  Available,
  Deleted
}

export enum Brand {
  iPhone,
  Oppo,
  Samsung,
  XiaoMi,
  Honor,
  Realme,
  Asus,
  Nokia,
  Vivo,
  Unknown
}

export enum PaymentMethod {
  Cash,
  Bank,
  Paypal
}

export enum PaymentStatus {
  Waiting,
  Success,
  Cancel
}

export type matchQuery = {
  created_at: {
    $gte: Date
    $lte: Date
  }
  'created_by._id'?: ObjectId
  'customer._id'?: ObjectId
}
