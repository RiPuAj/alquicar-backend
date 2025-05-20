import { handlerDatabaseError } from '../../errors/handler-error.js';
import { CreateMYSQLConnection } from './connectionCreater.js';
import fs from 'fs'
import { promises as pf } from 'fs';
import path from 'path';
import { promisify } from 'util';


const conn = await CreateMYSQLConnection.getConncetion();
const readFile = promisify(fs.readFile);
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
    static async deleteImage({ uuid, vehicle_id }) {
        try {

            const qry = `SELECT URL FROM \`${uuid}\` WHERE vehicle_id = ?`;
            const res = await conn.query(qry, vehicle_id);
            console.log('Ruta de la imagen:', res);
            if (res.length > 0) {
                const imagePath = res[0][0].URL;
                console.log('Ruta de la imagen:', imagePath);
                const fullPath = path.resolve(imagePath);
                console.log('Ruta completa de la imagen:', fullPath);
                await pf.unlink(imagePath);
                console.log(`Imagen eliminada: ${fullPath}`);
                const deleteQry = `DELETE FROM \`${uuid}\` WHERE vehicle_id = ?`;
                await conn.query(deleteQry, vehicle_id);
                return { success: true, message: 'Imagen eliminada' };
            }
            
        }catch(e){
            console.log(e);
            handlerDatabaseError({error: e});
        }
    }
    static async deleteProfileImage({ uuid }) {
        try {
            const qry = `SELECT URL FROM \`${uuid}\` WHERE vehicle_id = null`;
            const res = await conn.query(qry, vehicle_id);
            
            if (res.length > 0) {
                const imagePath = res[0].url;
                const fullPath = path.resolve(imagePath);
                await pf.unlink(fullPath);
                console.log(`Imagen eliminada: ${fullPath}`);
                const deleteQry = `DELETE FROM \`${uuid}\` WHERE vehicle_id = ?`;
                await conn.query(deleteQry, vehicle_id);
                return { success: true, message: 'Imagen eliminada' };
            }
            
        }catch(e){
            console.log(e);
            handlerDatabaseError({error: e});
        }
    }
    static async saveImagePath({ uuid, imagePath, vehicle_id = null }) {
        try {
            // Si vehicle_id está presente, lo usas
            const qry = vehicle_id
                ? `INSERT INTO \`${uuid}\` (vehicle_id, URL) VALUES (?, ?)`
                : `INSERT INTO \`${uuid}\` (URL) VALUES (?)`;
    
            const res = await conn.query(qry, vehicle_id ? [vehicle_id, imagePath] : [imagePath]);
            return res;
        } catch (e) {
            console.error(e);
            handlerDatabaseError({ error: e });
        }
    }
    static async getVehicleImagesBase64({ uuid, vehicle_id }) {
        try {
            const qry = `SELECT URL FROM \`${uuid}\` WHERE vehicle_id = ?`;
            const [rows] = await conn.query(qry, [vehicle_id]);
            if (rows.length === 0) {
                return null;
            }
            const images = await Promise.all(rows.map(async ({ URL }) => {
                try {
                    const buffer = await fs.promises.readFile(URL); // Usar `fs.promises.readFile` para promesas
                    const base64 = buffer.toString('base64');
                    const mime = URL.endsWith('.png') ? 'image/png' :
                                 URL.endsWith('.jpg') || URL.endsWith('.jpeg') ? 'image/jpeg' :
                                 'application/octet-stream';

                    return {
                        filename: URL.split('/').pop(),
                        mimeType: mime,
                        data: `data:${mime};base64,${base64}`
                    };
                } catch (err) {
                    console.error(`Error reading file ${URL}`, err);
                    return null;
                }
            }));

            return images.filter(Boolean); // Eliminar imágenes que no pudieron ser leídas
        } catch (e) {
            console.error(e);
            handlerDatabaseError({ error: e });
        }
    }

    

    static async getProfileImages({ uuid }) {
        try {
            const qry = `SELECT URL FROM \`${uuid}\` WHERE vehicle_id IS NULL`;
            const [rows] = await conn.query(qry);
            return rows;
        } catch (e) {
            console.error(e);
            handlerDatabaseError({ error: e });
        }
    }

static async getProfileImagesBase64({ uuid }) {
    try {
        const qry = `SELECT URL FROM \`${uuid}\` WHERE vehicle_id IS NULL`;
        const [rows] = await conn.query(qry);

        const images = await Promise.all(rows.map(async ({ URL }) => {
            try {
                const buffer = await readFile(URL);
                const base64 = buffer.toString('base64');
                const mime = URL.endsWith('.png') ? 'image/png' :
                             URL.endsWith('.jpg') || URL.endsWith('.jpeg') ? 'image/jpeg' :
                             'application/octet-stream';

                return {
                    filename: URL.split('/').pop(),
                    mimeType: mime,
                    data: `data:${mime};base64,${base64}`
                };
            } catch (err) {
                console.error(`Error reading file ${URL}`, err);
                return null;
            }
        }));

        return images.filter(Boolean);
    } catch (e) {
        console.error(e);
        handlerDatabaseError({ error: e });
    }
}


}