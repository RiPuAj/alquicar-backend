import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { handlerDatabaseError } from '../../errors.js';

dotenv.config();

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
}

const conn = await mysql.createConnection(config);

export class ReservationModel{
    static async getAll(){
        try{

            const [reservations, tableInfo] = await conn.query('SELECT id, vehicle_id, customer_id, start_date, end_date, total_price, status, created_at FROM reservations');
            return reservations;

        }catch(e){
            // TODO Manejar error
            console.log(e);
            throw new DatabaseError('Error getting all users');
        }
    }

    static async getById({id}){
            
            try{
    
                const [reservation, tableInfo] = await conn.query(
                    'SELECT id, vehicle_id, customer_id, start_date, end_date, total_price, status, created_at FROM reservations WHERE id = ?', [id]);
                return reservation;
    
            }catch(e){
                // TODO Manejar error
                console.log(e);
                throw new DatabaseError('Error getting reservation');
            }
    
            
        }
    
      
        
        static async create({input}){
    
            // TODO Hacer cuando ya esté en uso el correo
            // TODO Hacer cuando ya esté en uso el dni
            // TODO Hacer cuando ya esté en uso el teléfono
    
            // TODO Implementar las contraseñas encriptadas
    
            const {
                vehicle_id,
                customer_id,
                start_date,
                end_date,
                total_price,
                status,
                created_at
            } = input;
        
            let {id} = input; 
        
            if (!id) {
                // Si no hay ID, generar uno desde la base de datos
                const [uuidResult] = await conn.query('SELECT UUID() AS id');
                id = uuidResult[0].id;
            }
    
            try{
                await conn.query(`
                    INSERT INTO reservations (id, vehicle_id, customer_id, start_date, end_date, total_price, status, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [id, vehicle_id, customer_id, start_date, end_date, total_price, status, created_at]);
                
                return {success: true, message: 'reservation created', id};
    
            } catch(e){
                console.log(e.code);
                //TODO: manejar error
                handlerDatabaseError({err: e});            
            }
            
        }
        
        static async update({id, input}){
    
            //TODO Hacer cuando ya esté en uso el correo
            //TODO Hacer cuando ya esté en uso el dni
            //TODO Hacer cuando ya esté en uso el teléfono
            
    
            const fields = Object.keys(input);
            const values = Object.values(input);
            const updates = fields.map((field, index) => `${field} = ?`).join(', ');
    
            try{
                const [result] = await conn.query(
                    `UPDATE reservations SET ${updates} WHERE id = ?`, [...values, id]);
            }catch(e){
                console.log(e);
                handlerDatabaseError({err: {message: 'Error updating reservation'}});
                //TODO: manejar error
            } 
            
            const reservationUpdated = ReservationModel.getById({id});
        
            return reservationUpdated;
        }
        
        static async delete({id}){
    
            try{
    
                const res = await conn.query('DELETE FROM reservations WHERE id = ?', [id]);
                return res;
            
            } catch(e){
                // TODO Manejar error
                handlerDatabaseError({err: {message: 'Error deleting reservation'}});
            }
    
        }

}