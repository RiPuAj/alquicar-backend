import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { handlerDatabaseError } from '../../errors/handler-error.js';

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

        const existsOwner = await existOwner(owner_id);

        if(!existsOwner){
            return {
                success: false,
                message: 'Owner Id does not exist'
            };
        }

        const existsModel = await existModel(brand_id, model_id);

        if(!existsModel){
            return {
                success: false,
                message: 'Vehicle model does not exist'
            };
        }

        const optionalFields = ["deposit", "availability", "registration_date"];
        const fields = [
            "owner_id", "brand_id", "model_id", "year", "type", "transmission",
            "fuel_type", "capacity", "num_doors", "daily_price"
        ];
        const values = [
            "UUID_TO_BIN(?)", "?", "?", "?", "?", "?",
            "?", "?", "?", "?"
        ];
        const params = [
            owner_id, brand_id, model_id, year, type, transmission,
            fuel_type, capacity, num_doors, daily_price
        ];

        // Agregar los campos opcionales solo si están definidos
        optionalFields.forEach(field => {
            if (input[field] !== undefined) {
                fields.push(field);
                values.push("?");
                params.push(input[field]);
            }
        });

        try {
            const query = `INSERT INTO vehicles (${fields.join(", ")}) VALUES (${values.join(", ")})`;
            const [newVehicle] = await conn.query(query, params);
            
            const id = newVehicle.insertId;
            return { success: true, message: 'Vehicle created', id };

        } catch (e) {
            console.log(e);
            //TODO: manejar error
            return {
                success: false,
                message: 'Vehicle was not created'
            };
        }

    }


    static async update({id, input}){

        if(input.owner_id){
            const exist = await existOwner(input.owner_id)
            if(!exist){
                return {
                    success: false,
                    message: 'Owner Id does not exist'
                };
            }
        }      

        const fields = Object.keys(input).map(field => 
            field === "owner_id" ? `${field} = UUID_TO_BIN(?)` : `${field} = ?`
        );
        const values = Object.values(input);
        //const updates = fields.map((field, index) => `${field} = ?`).join(', ');

        if (fields.length === 0) {
            return {
                success: false,
                message: 'No fields provided for update'
            };
        }
    
        try{
            const [result] = await conn.query(
                `UPDATE vehicles SET ${fields.join(', ')} WHERE id = ?`, [...values, id]);

            if (result.affectedRows === 0) {
                return {
                    success: false,
                    message: 'No vehicle found with the given ID'
                };
            }
        }catch(e){
            console.log(e);
            return {
                success: false,
                message: 'Error updating vehicle'
            };
                //handlerDatabaseError({err: {message: 'Error updating vehicle'}});
        }
            
        const vehicleUpdated = await VehicleModel.getById({id});
        
        return { success: true, message: 'Vehicle updated', vehicle: vehicleUpdated };
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


    async function existOwner(ownerId) {

        const [result] = await conn.query('SELECT EXISTS(SELECT 1 FROM users WHERE id = UUID_TO_BIN(?)) AS owner_exists', [ownerId]);
        return result[0].owner_exists === 1 ? true : false;
    
    }

    async function existModel(brandId, modelId){
        const [result] = await conn.query(
            `SELECT EXISTS(
                SELECT 1 FROM vehicles_models 
                WHERE id = ? AND brand_id = ?
            ) AS model_exists`, 
            [modelId, brandId]
        );
    
        return result[0].model_exists === 1;
    }