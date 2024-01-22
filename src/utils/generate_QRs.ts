import { UPLOAD_QRS_DIR } from '~/constants/dirs'
import path from 'path'
import QRCode from 'qrcode'
import { ObjectId } from 'mongodb'
import { env_config } from '~/constants/config'
export const createQR = (url: string) => {
  const qr_id = new ObjectId()
  const outputFilePath = path.resolve(UPLOAD_QRS_DIR, `${qr_id.toString()}.jpg`)
  return new Promise((resolve, reject) => {
    QRCode.toFile(outputFilePath, url, (error) => {
      if (error) {
        return reject(error)
      } else {
        if (env_config.host == 'https://pops-backend') {
          const qr_code1 = `${env_config.host}/static/paypal/${qr_id.toString()}.jpg`
          return resolve(qr_code1)
        }
        const qr_code2 = `${env_config.host}:${env_config.port}/static/paypal/${qr_id.toString()}.jpg`
        return resolve(qr_code2)
      }
    })
  })
}
