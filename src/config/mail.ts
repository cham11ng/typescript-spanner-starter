import * as dotenv from 'dotenv';

dotenv.config();

export default {
  smtp: {
    port: process.env.MAIL_PORT || 2525,
    host: process.env.MAIL_HOST || 'smtp.mailtrap.io',
    auth: {
      user: process.env.MAIL_SMTP_USERNAME || '',
      pass: process.env.MAIL_SMTP_PASSWORD || ''
    }
  },
  from: {
    address: process.env.MAIL_ADDRESS || 'test@prenav.com',
    name: process.env.MAIL_NAME || 'PreNav'
  }
};