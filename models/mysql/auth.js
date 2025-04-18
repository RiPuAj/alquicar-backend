import { handlerDatabaseError } from '../../errors/handler-error.js';
import { CreateMYSQLConnection } from './mysql-config.js';
import jwt from 'jsonwebtoken';

const conn = await CreateMYSQLConnection.getConncetion();
export class AuthModel{
    static async createSession({user,token}){
        try{
            const decoded = jwt.decode(token);
            const expiresAt = new Date(decoded.exp * 1000);
            await conn.query(`
                INSERT INTO sessions (sessionid, user_id, expires_at)
                VALUES (?, UUID_TO_BIN(?), ?)
              `, [token, user.id, expiresAt]);
        
              return { success: true };
        }catch(e){
            // TODO Manejar error
            console.log(e);
        }
    }
}