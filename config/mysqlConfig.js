import dotenv from 'dotenv';

dotenv.config({path: '../.env'});

export const mysqlConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
};
