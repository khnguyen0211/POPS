import { ObjectId } from 'mongodb'
import { User } from './users.schema'

type VoucherType = {
  _id?: ObjectId
  code: string
  value: number
  created_at?: Date
  expire_at?: Date
}

export class Voucher {
  _id: ObjectId
  code: string
  value: number
  isUsed: boolean
  created_at: Date
  expire_at: Date

  constructor(voucher: VoucherType) {
    this._id = voucher._id || new ObjectId()
    this.code = voucher.code
    this.value = voucher.value
    this.isUsed = false
    this.created_at = voucher.created_at || this.setExpireDay(0)
    this.expire_at = voucher.expire_at || this.setExpireDay(7)
  }

  setExpireDay = (days: number) => {
    const currentDate = new Date()

    currentDate.setDate(currentDate.getDate() + days)

    return currentDate
  }
}
