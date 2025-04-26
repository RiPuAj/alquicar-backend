import { handlerDatabaseError } from '../../errors/handler-error.js';
import { CreateMYSQLConnection } from './mysql-config.js';
import fs from 'fs'
const conn = await CreateMYSQLConnection.getConncetion();
export class MediaModel{
    
    static async create({ input }){   
        try{
            const qry = `CREATE TABLE \`${input.id}\` (id INT AUTO_INCREMENT PRIMARY KEY,
            vehicle_id INT, URL VARCHAR(255), 
            FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
            );
            `
            const res = await conn.query(qry);
            fs.mkdir(`assets/${input.id}`, { recursive: true }, (err) => {
            if (err) {
                console.error('Error creando la carpeta:', err);
            } else {
                console.log('Carpeta creada exitosamente');
            }
            });
            return res; 
        } catch(e){ 
            console.log(e);
            handlerDatabaseError({error: e});
        }
        
    }
}