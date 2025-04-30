import { CreateMYSQLConnection } from "./mysql-config.js";

const conn = await CreateMYSQLConnection.getConncetion();

export class MessagesModel{
    
    static async create({input}){

        try{
            await conn.query("INSERT INTO messages (from_id, to_id, content) VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), ?)", [input.from_id, input.to_id, input.message]);

        } catch(e){
            throw new DatabaseError('Error en el envio de mensaje');
        }

    }
        
}