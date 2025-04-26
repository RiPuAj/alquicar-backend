import { handlerDatabaseError } from '../../errors/handler-error.js';
import { CreateMYSQLConnection } from './mysql-config.js';

const conn = await CreateMYSQLConnection.getConncetion();
export class MediaModel{
    
    static async create({ input }){
        console.log(input);    
        try{
            const qry = `CREATE TABLE \`${input.id}\` (id INT AUTO_INCREMENT PRIMARY KEY,
            vehicle_id INT, URL VARCHAR(255), 
            FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
            );
            `
            const res = await conn.query(qry);
            return res; 
        } catch(e){ 
            console.log(e);
            handlerDatabaseError({error: e});
        }
        
    }
}