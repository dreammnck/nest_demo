import * as dotenv from 'dotenv';

const envType = process.env.NODE_ENV || 'development';
dotenv.config({ path: '.env.'.concat(envType) });

export default () => ({
  port: parseInt(process.env.PORT, 10) || 8080,
  database_url: process.env.DATABASE_URL,
  salt: parseInt(process.env.SALT),
  secret: String(process.env.SECRET),
});
