import { S3 } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import fs from 'fs'
import { env_config } from '~/constants/config'
const s3 = new S3({
  region: env_config.aws_region,
  credentials: {
    secretAccessKey: env_config.aws_secret_access_key,
    accessKeyId: env_config.aws_access_key_id
  }
})

export const uploadFileToS3 = ({
  filename,
  filepath,
  contentType
}: {
  filename: string
  filepath: string
  contentType: string
}) => {
  const parallelUploads3 = new Upload({
    client: s3,
    params: {
      Bucket: env_config.aws_s3_bucket,
      Key: filename,
      Body: fs.readFileSync(filepath),
      ContentType: contentType
    },
    tags: [
      /*...*/
    ], // optional tags
    queueSize: 4, // optional concurrency configuration
    partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
    leavePartsOnError: false // optional manually handle dropped parts
  })
  return parallelUploads3.done()
}
