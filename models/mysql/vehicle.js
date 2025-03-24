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


export class VehicleModel {
    static async getAll() {

        try {
            const [vehicles, tableInfo] = await conn.query('SELECT *, BIN_TO_UUID(owner_id) AS owner_id FROM vehicles');

            //const [vehicles, tableInfo] = await conn.query('SELECT  id, BIN_TO_UUID(owner_id) owner_id, brand_id, model_id, year, type, transmission, fuel_type, capacity, num_doors, daily_price, deposit, availability, registration_date FROM vehicles');
            return vehicles;

        } catch (e) {
            // TODO Manejar error
            console.log(e);
            throw new DatabaseError('Error getting all vehicles');
        }
    }

    static async getById({ id }) {

        try {

            const [vehicle, tableInfo] = await conn.query(
                'SELECT *, BIN_TO_UUID(owner_id) AS owner_id FROM vehicles WHERE id = ?', [id]);
            return vehicle;

        } catch (e) {
            // TODO Manejar error
            console.log(e);
            throw new DatabaseError('Error getting vehicle');
        }


    }

    static async create({ input }) {

        const {
            owner_id,
            brand_id,
            model_id,
            year,
            type,
            transmission,
            fuel_type,
            capacity,
            num_doors,
            daily_price,
        } = input;

        let { deposit, availability, registration_date } = input;


        try {
            const newVehicle = await conn.query(`
                    INSERT INTO vehicles (owner_id, brand_id, model_id, year, type, transmission, fuel_type, capacity, num_doors,
                    daily_price, deposit, availability, registration_date)
                    VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [owner_id, brand_id, model_id, year, type, transmission, fuel_type, capacity, num_doors,
                daily_price, deposit, availability, registration_date]);
            console.log(newVehicle)
            return { success: true, message: 'Vehicle created'};

        } catch (e) {
            console.log(e);
            //TODO: manejar error
            return {
                success: false,
                message: 'Vehicle was not created'
            };
        }

    }


    update = async ({ id, input }) => {
        return await this.database.query('UPDATE vehicles SET ? WHERE id = ?', [input, id]);
    }


    static async delete({id}) {
        try {

            const res = await conn.query('DELETE FROM vehicles WHERE id = ?', [id]);
            return res;

        } catch (e) {
            handlerDatabaseError({ err: { message: 'Error deleting vehicle' } });
        }


    }
}