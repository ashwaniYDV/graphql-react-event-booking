require('dotenv').config();

module.exports={
    JWT_SECRET: process.env.JWT_SEC,
    DB_URI: process.env.MONGODB_URI,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD
}