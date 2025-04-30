import mysql from 'mysql2/promise';
import { mysqlConfig } from '../../config/mysqlConfig.js';
import { handlerDatabaseError } from '../../errors/handler-error.js';



export class CreateMYSQLConnection{
    static conn = null;


    static async getConncetion(){
        if(!CreateMYSQLConnection.conn){
            try{
                CreateMYSQLConnection.conn = await mysql.createConnection(mysqlConfig);
                return CreateMYSQLConnection.conn;

            } catch(e){
                console.log(e);
                handlerDatabaseError({error: e});
            }
        }

        return CreateMYSQLConnection.conn;
    }
}