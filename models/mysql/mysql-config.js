import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { handlerDatabaseError } from '../../errors/handler-error.js';

dotenv.config();


const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
};


export class CreateMYSQLConnection{
    static conn = null;


    static async getConncetion(){
        if(!CreateMYSQLConnection.conn){
            try{
                CreateMYSQLConnection.conn = await mysql.createConnection(config);
                return CreateMYSQLConnection.conn;

            } catch(e){
                console.log(e);
                handlerDatabaseError({error: e});
            }
        }

        return CreateMYSQLConnection.conn;
    }
}