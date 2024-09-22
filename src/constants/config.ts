import { config } from 'dotenv'
const env = process.env.NODE_ENV
const envFileName = `.env.${env}`
config({
  path: envFileName
})
export const env_config = {
  host: process.env.HOST as string,
  port: process.env.PORT as string,
  db_name: process.env.DB_NAME as string,
  db_user_name: process.env.DB_USER_NAME as string,
  db_password: process.env.DB_PASSWORD as string,
  user_collection: process.env.DB_USER_COLLECTION as string,
  product_collection: process.env.DB_PRODUCT_COLLECTION as string,
  refresh_token_collection: process.env.DB_REFRESH_TOKEN_COLLECTION as string,
  customer_collection: process.env.DB_CUSTOMER_COLLECTION as string,
  voucher_collection: process.env.DB_VOUCHER_COLLECTION as string,
  order_collection: process.env.DB_ORDER_COLLECTION as string,
  invoice_collection: process.env.DB_INVOICE_COLLECTION as string,
  conversation_collection: process.env.DB_CONVERSATION_COLLECTION as string,
  jwt_access_token_secret_key: process.env.JWT_ACCESS_TOKEN_SECRET_KEY as string,
  jwt_refresh_token_secret_key: process.env.JWT_REFRESH_TOKEN_SECRET_KEY as string,
  jwt_verify_token_secret_key: process.env.JWT_VERIFY_TOKEN_SECRET_KEY as string,
  jwt_access_token_expires: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN as string,
  jwt_refresh_token_expires: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN as string,
  jwt_verify_token_expires: process.env.JWT_VERIFY_TOKEN_EXPIRES_IN as string,
  aws_access_key_id: process.env.AWS_ACCESS_KEY_ID as string,
  aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY as string,
  aws_region: process.env.AWS_REGION as string,
  aws_s3_bucket: process.env.AWS_S3_BUCKET as string,
  ses_from_address: process.env.SES_FROM_ADDRESS as string,
  google_client_id: process.env.GOOGLE_CLIENT_ID as string,
  google_secret_key: process.env.GOOGLE_SECRET_KEY as string,
  paypal_client_id: process.env.PAYPAL_CLIENT_ID as string,
  paypal_secret_key: process.env.PAYPAL_SECRET_KEY as string,
}
