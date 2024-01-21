import { faker } from '@faker-js/faker'

export type CustomerType = {
  full_name: string
  phone_number: string
  address: string
}

export class Customer {
  full_name: string
  phone_number: string
  address: string
  avatar: string
  created_at: Date
  updated_at: Date
  constructor(cus: CustomerType) {
    const today = new Date()
    this.full_name = cus.full_name
    this.phone_number = this.formatPhoneNumber(cus.phone_number)
    this.address = cus.address
    this.avatar = faker.image.urlPicsumPhotos()
    this.created_at = today
    this.updated_at = today
  }

  formatPhoneNumber(phone_number: string) {
    const format_phone_number = `${phone_number.slice(0, 4)}.${phone_number.slice(4, 7)}.${phone_number.slice(7, 10)}`
    return format_phone_number
  }
}
