import { handlerDatabaseError } from '../../errors/handler-error.js';
import { CreateMYSQLConnection } from './mysql-config.js';

const conn = await CreateMYSQLConnection.getConncetion();
export class MediaModel{
    
    static async create({ input }){
            input.uuid
            const res = await conn.query("")
        return
    }
}