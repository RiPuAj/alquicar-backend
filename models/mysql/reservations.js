import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { validateReservation, validatePartialReservation } from '../../schemas/reservations.js';
import { DatabaseError, handlerDatabaseError } from '../../errors/database-error.js';
import { ValidationError } from '../../errors/validation-error.js';

dotenv.config();

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
}

const conn = await mysql.createConnection(config);

export class ReservationModel {

    static async getAll() {
        try {

            const [reservations, tableInfo] = await conn.query('SELECT id, vehicle_id, BIN_TO_UUID(customer_id) customer_id, start_date, end_date, total_price, status, created_at FROM reservations');
            return reservations;

        } catch (e) {
            // TODO Manejar error
            console.log(e);
            throw new DatabaseError('Error getting all users');
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
}