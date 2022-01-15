import * as dotenv from 'dotenv';

const envType = process.env.NODE_ENV || 'development';
dotenv.config({ path: '.env.'.concat(envType)});


export default () => ({
  port: parseInt(process.env.PORT, 10) || 5000,
  database_url: process.env.DATABASE_URL, // เดา55555555
  salt: parseInt(process.env.SALT) ,
  secret: String(process.env.SECRET),
});
