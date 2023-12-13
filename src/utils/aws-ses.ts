/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses'
import fs from 'fs'
import path from 'path'
import { env_config } from '~/constants/config'

// Create SES service object.
const sesClient = new SESClient({
  region: env_config.aws_region,
  credentials: {
    secretAccessKey: env_config.aws_secret_access_key,
    accessKeyId: env_config.aws_access_key_id
  }
})

const createSendEmailCommand = ({
  fromAddress,
  toAddresses,
  ccAddresses = [],
  body,
  subject,
  replyToAddresses = []
}: {
  fromAddress: string
  toAddresses: string | string[]
  ccAddresses?: string | string[]
  body: string
  subject: string
  replyToAddresses?: string | string[]
}) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: ccAddresses instanceof Array ? ccAddresses : [ccAddresses],
      ToAddresses: toAddresses instanceof Array ? toAddresses : [toAddresses]
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: 'UTF-8',
          Data: body
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    Source: fromAddress,
    ReplyToAddresses: replyToAddresses instanceof Array ? replyToAddresses : [replyToAddresses]
  })
}

export const sendEmail = async (toAddress: string, subject: string, body: string) => {
  const sendEmailCommand = await createSendEmailCommand({
    fromAddress: env_config.ses_from_address,
    toAddresses: toAddress,
    body,
    subject
  })
  return sesClient.send(sendEmailCommand)
}
const verifyEmailTemplate = fs.readFileSync(path.resolve('src/templates/email.html'), 'utf8')

export const sendVerifyEmail = (
  toAddress: string,
  email_verify_token: string,
  template: string = verifyEmailTemplate
) => {
  return sendEmail(
    toAddress,
    'Verify your email',
    template.replace('{{verify_email_url}}', `http://localhost:3000/email-verifications/${email_verify_token}`)
  )
}
