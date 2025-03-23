import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
<<<<<<< HEAD
import { validateReservation, validatePartialReservation } from '../../schemas/reservations.js';
import { DatabaseError, handlerDatabaseError } from '../../errors/database-error.js';
import { ValidationError } from '../../errors/validation-error.js';
=======
import { handlerDatabaseError } from '../../errors.js';
>>>>>>> 190600066f9dbda46bdd5592b59c80c67bcfd693

dotenv.config();

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
}

const conn = await mysql.createConnection(config);

<<<<<<< HEAD
export class ReservationModel {

    static async getAll() {
        try {
=======
export class ReservationModel{
    static async getAll(){
        try{
>>>>>>> 190600066f9dbda46bdd5592b59c80c67bcfd693

            const [reservations, tableInfo] = await conn.query('SELECT id, vehicle_id, BIN_TO_UUID(customer_id) customer_id, start_date, end_date, total_price, status, created_at FROM reservations');
            return reservations;

<<<<<<< HEAD
        } catch (e) {
=======
        }catch(e){
>>>>>>> 190600066f9dbda46bdd5592b59c80c67bcfd693
            // TODO Manejar error
            console.log(e);
            throw new DatabaseError('Error getting all users');
        }
    }

<<<<<<< HEAD
    static async getById({ id }) {
        try {

            const [reservation, tableInfo] = await conn.query(
                'SELECT id, vehicle_id, BIN_TO_UUID(customer_id) customer_id, start_date, end_date, total_price, status, created_at FROM reservations WHERE id = ?', [id]);
            return reservation;

        } catch (e) {
            // TODO Manejar error
            console.log(e);
            throw new DatabaseError('Error getting user');
        }
    }

    static async create({ input }) {

        const reservationValidation = validateReservation(input);

        if (!reservationValidation.success) {
            //TODO ERROR HANDLING
            throw new ValidationError(reservationValidation.error);
        }

        const { 
            vehicle_id,
            customer_id, 
            start_date, 
            end_date, 
            total_price, 
            status 
        } = input;

        try {
            // Verificar si el vehículo y el usuario que alquila existe
            const existVehicleAndCustomer = await conn.query(
                'SELECT EXISTS(SELECT 1 FROM vehicles WHERE id = ?) AS vehicle_exists,' +
                'EXISTS(SELECT 1 FROM users WHERE id = UUID_TO_BIN(?)) AS customer_exists',
                [vehicle_id, customer_id]);

            if (!existVehicleAndCustomer[0][0].vehicle_exists) {
                throw new ValidationError('Vehicle does not exist');
            } else if (!existVehicleAndCustomer[0][0].customer_exists) {
                throw new ValidationError('Customer does not exist');
            }

            const [result] = await conn.query(
                'INSERT INTO reservations (vehicle_id, customer_id, start_date, end_date, total_price, status) VALUES (?, UUID_TO_BIN(?), ?, ?, ?, ?)',
                [vehicle_id, customer_id, start_date, end_date, total_price, status]
            );
            return result;

        } catch (e) {
            // TODO Manejar error
            throw new DatabaseError('Error creating reservation');
        }
    }

    static async update({ id, input }) {
        const reservationValidation = validatePartialReservation({ input });

        if (!reservationValidation.success) {
            //TODO ERROR HANDLING
            console.log(reservationValidation.error);
            throw new ValidationError(reservationValidation.error);
        }

        const fields = Object.keys(input);
        const values = Object.values(input);
        const updates = fields.map((field, index) => `${field} = ?`).join(', ');
        console.log(input);

        try {
            const [result] = await conn.query(
                `UPDATE reservations SET ${updates} WHERE id = ?`, [...values, id]);
            return result;

        } catch (e) {
            // TODO Manejar error
            handlerDatabaseError({ err: e });
        }
    }

    static async delete({ id }) {
    }

    existVehicle = async ({ idVehicle }) => {
        try {
            const [result] = await conn.query('SELECT EXISTS(SELECT 1 FROM vehicles WHERE id = ?) AS vehicle_exists', [idVehicle]);
            return result[0].vehicle_exists === 1 ? true : false;
        } catch (e) {
            throw new DatabaseError('Vehicle does not exist');
        }
    }

    existCustomer = async ({ idCustomer }) => {
        try {
            const [result] = await conn.query('SELECT EXISTS(SELECT 1 FROM users WHERE id = UUID_TO_BIN(?)) AS customer_exists', [idCustomer]);
            return result[0].customer_exists === 1 ? true : false;
        } catch (e) {
            throw new DatabaseError('Customer does not exist');
        }
    }
=======
    static async getById({id}){
            
            try{
    
                const [reservation, tableInfo] = await conn.query(
                    'SELECT id, vehicle_id, BIN_TO_UUID(customer_id) customer_id, start_date, end_date, total_price, status, created_at FROM reservations WHERE id = ?', [id]);
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
                    VALUES (?, ?, BIN_TO_UUID(?), ?, ?, ?, ?, ?)`, [id, vehicle_id, customer_id, start_date, end_date, total_price, status, created_at]);
                
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

>>>>>>> 190600066f9dbda46bdd5592b59c80c67bcfd693
}