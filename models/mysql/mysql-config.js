import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { handlerDatabaseError } from '../../errors.js';


//TODO IMPLEMENTAR
export const createConnection = async () => {
    dotenv.config();

    const config = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        port: process.env.DB_PORT,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    };

    try{
        const conn = await mysql.createConnection(config);
        return conn;
    }
    catch(e){
        console.log(e);
        throw new handlerDatabaseError('Error connecting to the database');
    }
}