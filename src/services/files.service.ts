import { Request } from 'express'
import { handleOriginalImage } from '~/utils/files_handle'
import path from 'path'
import { UPLOAD_AVATARS_DIR, UPLOAD_PRODUCTS_DIR } from '~/constants/dirs'
import sharp from 'sharp'
import fs from 'fs'
import { uploadFileToS3 } from '~/utils/aws-s3'
import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3'
import { env_config } from '~/constants/config'

class FileService {
  async compressFile(req: Request) {
    const files = await handleOriginalImage(req)
    return await Promise.all(
      files.map(async (file) => {
        const newFileName = getNameByFullName(file.newFilename)
        const newFileFullName = `${newFileName}.jpg`
        const newPath = path.resolve(UPLOAD_AVATARS_DIR, newFileFullName)

        await sharp(file.filepath).jpeg().toFile(newPath)
        const aws_s3 = await uploadFileToS3({
          filename: newFileFullName,
          filepath: newPath,
          contentType: 'image/jpeg'
        })
        fs.unlinkSync(file.filepath)
        return (aws_s3 as CompleteMultipartUploadCommandOutput).Location as string
      })
    )
  }

  async compressProductImgFile(req: Request) {
    const files = await handleOriginalImage(req)
    return await Promise.all(
      files.map(async (file) => {
        const newFileName = getNameByFullName(file.newFilename)
        const newPath = path.resolve(UPLOAD_PRODUCTS_DIR, `${newFileName}.jpg`)
        await sharp(file.filepath).jpeg().toFile(newPath)
        fs.unlinkSync(file.filepath)
        return `${env_config.host}:${env_config.port}/static/products/${newFileName}.jpg`
      })
    )
  }
}

export const fileService = new FileService()

export const getNameByFullName = (full_name: string) => {
  const arrString = full_name.split('.')
  arrString.pop()
  return arrString.join('')
}
