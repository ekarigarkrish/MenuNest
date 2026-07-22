import dotenv from 'dotenv'
dotenv.config({ quiet: true, path: `.env.${process.env.NODE_ENV}` })

export default {
    node_env: process.env.NODE_ENV,
    isDEV: process.env.NODE_ENV === 'dev',
    port: Number(process.env.PORT),
    clientOrigin: process.env.CLIENT_ORIGIN,
    csrfSecretKey: process.env.CSRF_SECERT_KEY,
    secretKey: process.env.SECRET_KEY,

    // allowed image Extensions
    allowedImageExtensions: ['.jpeg', '.jpg', '.png'],

    // Databse
    db_host: process.env.DB_HOST,
    db_name: process.env.DB_NAME,
    db_pass: process.env.DB_PASS,
    db_port: Number(process.env.DB_PORT),
    db_user: process.env.DB_USER,
}