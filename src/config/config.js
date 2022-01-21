const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env.local') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').default('development'),
    PORT: Joi.number().default(8080),
    APP_URL: Joi.string().required().description('Frontend url'),
    COMPANY_NAME: Joi.string().description('Name of company'),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_MOODBOARD_INVITE_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description('days after which invite to moodboard token expires'),
    POSTMARK_API_KEY: Joi.string().description('Postmark API Key'),
    POSTMARK_TEMPLATE_ID_WELCOME: Joi.string().description('Postmark Template Id for Welcome email'),
    POSTMARK_TEMPLATE_ID_RESET_PASSWORD: Joi.string().description('Postmark Template Id for Password Reset email'),
    POSTMARK_TEMPLATE_ID_CREATE_AND_INVITE: Joi.string().description(
      'Postmark Template Id for inviting new user to habitat'
    ),
    POSTMARK_TEMPLATE_ID_ACCEPT_HABITAT_INVITE: Joi.string().description(
      'Postmark Template Id for existing user to accept habitat invitation'
    ),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    AWS_ACCESS_KEY_ID: Joi.string().description('AWS Access Key'),
    AWS_SECRET_ACCESS_KEY: Joi.string().description('AWS Secret Key'),
    AWS_DEFAULT_REGION: Joi.string().description('AWS Region'),
    AWS_S3_BUCKET: Joi.string().description('AWS Bucket name'),
    GOOGLE_API_KEY: Joi.string().description('Google API Key'),
    GOOGLE_CSE_ID: Joi.string().description('Google Custom Search Engine Id'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  companyName: envVars.COMPANY_NAME,
  appUrl: envVars.APP_URL,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    inviteToMoodboardExpirationDays: envVars.JWT_MOODBOARD_INVITE_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: 10,
  },
  email: {
    postmarkApiKey: envVars.POSTMARK_API_KEY,
    welcomeTemplateId: envVars.POSTMARK_TEMPLATE_ID_WELCOME,
    resetPasswordTemplateId: envVars.POSTMARK_TEMPLATE_ID_RESET_PASSWORD,
    inviteTemplateId: envVars.POSTMARK_TEMPLATE_ID_CREATE_AND_INVITE,
    acceptInviteTemplateId: envVars.POSTMARK_TEMPLATE_ID_ACCEPT_HABITAT_INVITE,
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  aws: {
    key: envVars.AWS_ACCESS_KEY_ID,
    secret: envVars.AWS_SECRET_ACCESS_KEY,
    region: envVars.AWS_DEFAULT_REGION,
    s3Bucket: envVars.AWS_S3_BUCKET,
  },
  google: {
    key: envVars.GOOGLE_API_KEY,
    cx: envVars.GOOGLE_CSE_ID,
  },
};
