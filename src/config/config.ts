import * as dotenv from 'dotenv';

const path = `.env${process.env.ENV_TYPE}` || 'developmemt';
dotenv.config({ path: path });

export default () => ({
  port: parseInt(process.env.PORT, 10) || 5000,
  database_url: String(process.env.DATABASE_URL), // เดา55555555
  salt: parseInt(process.env.SALT),
  secret: process.env.SECRET,
});
