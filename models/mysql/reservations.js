import { validateReservation, validatePartialReservation } from '../../schemas/reservations.js';
import {handlerDatabaseError } from '../../errors/handler-error.js';
import { ValidationError } from '../../errors/validation-error.js';
import { CreateMYSQLConnection } from './connectionCreater.js';
import { DatabaseError } from '../../errors/database-error.js';


const conn = await CreateMYSQLConnection.getConncetion();

export class ReservationModel {

    static async getAll() {
        try {

            const [reservations, tableInfo] = await conn.query('SELECT id, vehicle_id, BIN_TO_UUID(customer_id) customer_id, start_date, end_date, total_price, status, created_at FROM reservations');
            return reservations;

        } catch (e) {
            // TODO Manejar error
            console.log(e);
            handlerDatabaseError({error: new DatabaseError('Error getting all users')});
        }
    }

    static async getById({ id }) {

        try {

            const [reservation, tableInfo] = await conn.query(
                'SELECT id, vehicle_id, BIN_TO_UUID(customer_id) customer_id, start_date, end_date, total_price, status, created_at FROM reservations WHERE id = ?', [id]);
            return reservation;

        } catch (e) {
            // TODO Manejar error
            console.log(e);
            handlerDatabaseError({error: new DatabaseError('Error getting user')});
        }
    }

    static async create({ input }) {

        const reservationValidation = validateReservation(input);

        if (!reservationValidation.success) {
            //TODO ERROR HANDLING
            throw new ValidationError(reservationValidation.error);
        }


        if (!input.status) input.status = 'Pending';

        const {
            vehicle_id,
            customer_id,
            total_price,
            status
        } = input;

        let start_date = changeDateFormat(input.start_date);
        let end_date = changeDateFormat(input.end_date);

        try {
            // Verificar si el vehículo y el usuario que alquila existe
            if(!(await existVehicle({ idVehicle: vehicle_id }))) handlerDatabaseError({error: new DatabaseError('Vehicle does not exist')});
            if(!(await existCustomer({ idCustomer: customer_id }))) handlerDatabaseError({error: new DatabaseError('Customer does not exist')});
            if(!(await freeVehicleByDates({ idVehicle: vehicle_id, startDate: start_date, endDate: end_date }))) handlerDatabaseError({error: new DatabaseError('Vehicle is busy')});
         
            const [result] = await conn.query(
                'INSERT INTO reservations (vehicle_id, customer_id, start_date, end_date, total_price, status) VALUES (?, UUID_TO_BIN(?), ?, ?, ?, ?)',
                [vehicle_id, customer_id, start_date, end_date, total_price, status]
            );
           
            const newReservation = await this.getById({ id: result.insertId });
            return newReservation;

        } catch (e) {
            // TODO Manejar error
            console.log(e);
            handlerDatabaseError({error: e});
        }
    }

    static async update({ id, input }) {
        const reservationValidation = validatePartialReservation({ input });

        if (!reservationValidation.success) {
            //TODO ERROR HANDLING
            throw new ValidationError(reservationValidation.error);
        }

        // Campos que no se pueden modificar
        if(input.id || input.vehicle_id || input.customer_id) handlerDatabaseError({error: new DatabaseError('Cannot update id, vehicle_id or customer_id')});

        if(input.start_date) input.start_date = changeDateFormat(input.start_date);
        if(input.end_date) input.end_date = changeDateFormat(input.end_date);

        const fields = Object.keys(input);
        const values = Object.values(input);
        const updates = fields.map((field, index) => `${field} = ?`).join(', ');

        try {
            const [result] = await conn.query(
                `UPDATE reservations SET ${updates} WHERE id = ?`, [...values, id]);
            if (result.affectedRows === 0) handlerDatabaseError({error: new DatabaseError('Reservation not found')});

            const reservation = await this.getById({ id });
            return reservation;

        } catch (e) {
            // TODO Manejar error
            handlerDatabaseError({ error: e });
        }
    }

    static async delete({ id }) {

        try {
            const [result] = await conn.query('DELETE FROM reservations WHERE id = ?', [id]);
            
            return {success: true, message: 'Reservation deleted', id: id};

        } catch (e) {
            // TODO Manejar error
            handlerDatabaseError({ error: e });
        }
    }

    static async getReservationsByVehicle({ idVehicle }) {
        
        try {
            if(!(await existVehicle({ idVehicle }))) handlerDatabaseError({error: new DatabaseError('Vehicle does not exist')});
            
            const [reservations, tableInfo] = await conn.query(
                'SELECT id, vehicle_id, BIN_TO_UUID(customer_id) customer_id, start_date, end_date, total_price, status, created_at FROM reservations WHERE vehicle_id = ?', [idVehicle]);
            return reservations;

        } catch (e) {
            // TODO Manejar error
            handlerDatabaseError({ error: e });
        }
    }

    static async getReservationsByCustomer({ idCustomer }) {
        
        try {
            if(!(await existCustomer({ idCustomer }))) handlerDatabaseError({error: new DatabaseError('Customer does not exist')});

            const [reservations, tableInfo] = await conn.query(
                'SELECT id, vehicle_id, BIN_TO_UUID(customer_id) customer_id, start_date, end_date, total_price, status, created_at FROM reservations WHERE customer_id = UUID_TO_BIN(?)', [idCustomer]);
            return reservations;

        } catch (e) {
            // TODO Manejar error
            handlerDatabaseError({ error: e });
        }
    }
}

async function existVehicle({ idVehicle }) {

    const [result] = await conn.query('SELECT EXISTS(SELECT 1 FROM vehicles WHERE id = ?) AS vehicle_exists', [idVehicle]);
    return result[0].vehicle_exists === 1 ? true : false;

}

async function existCustomer({ idCustomer }) {

    const [result] = await conn.query('SELECT EXISTS(SELECT 1 FROM users WHERE id = UUID_TO_BIN(?)) AS customer_exists', [idCustomer]);
    return result[0].customer_exists === 1 ? true : false;

}

async function freeVehicleByDates({ idVehicle, startDate, endDate }) {

    const [result] = await conn.query(
        'SELECT EXISTS(SELECT 1 FROM reservations WHERE vehicle_id = ? AND ((start_date BETWEEN ? AND ?) OR (end_date BETWEEN ? AND ?))) AS vehicle_busy',
        [idVehicle, startDate, endDate, startDate, endDate]);

    return result[0].vehicle_busy === 1 ? false : true;

}

function changeDateFormat(date) {
    const formattedDate = date.replace("T", " ").replace("Z", "");
    return formattedDate; 
}