import { Request } from 'express'
import { File } from 'formidable'
import fs from 'fs'
import { UPLOAD_AVATARS_DIR, UPLOAD_PRODUCTS_DIR, UPLOAD_QRS_DIR, UPLOAD_TEMP_DIR } from '~/constants/dirs'
import { SERVER_MESSAGES } from '~/constants/messages'
import { SERVER_STATUS_CODE } from '~/constants/statuses'
import { ErrorWithStatus } from '~/models/Errors'

export const initialUploads = () => {
  ;[UPLOAD_AVATARS_DIR, UPLOAD_PRODUCTS_DIR, UPLOAD_TEMP_DIR, UPLOAD_QRS_DIR].map((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true
      })
    }
  })
}

export const handleOriginalImage = async (req: Request) => {
  const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: UPLOAD_TEMP_DIR,
    maxFiles: 4,
    keepExtensions: true,
    maxFieldsSize: 300 * 1024 * 4,
    filter: ({ name, originalFilename, mimetype }) => {
      const flag = name === 'image' && Boolean(mimetype?.includes('image'))
      if (!flag) {
        form.emit('error' as any, new Error('Filetype is not supported') as any)
      }
      return flag
    }
  })

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      if (!files.image) {
        return reject(
          new ErrorWithStatus({
            message: SERVER_MESSAGES.IMAGE_FILE_IS_REQUIRED,
            status_code: SERVER_STATUS_CODE.UNPROCESSABLE_ENTITY
          })
        )
      }
      return resolve(files.image as File[])
    })
  })
}
