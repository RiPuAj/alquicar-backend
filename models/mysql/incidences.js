import { handlerDatabaseError } from '../../errors/handler-error.js';
import { CreateMYSQLConnection } from './mysql-config.js';



const conn = await CreateMYSQLConnection.getConncetion();


export class IncidenceModel {
    static async getAll() {

        try {
            const [incidences, tableInfo] = await conn.query('SELECT *, BIN_TO_UUID(from_id) AS from_id, BIN_TO_UUID(to_id) AS to_id FROM incidences');
            
            return incidences;

        } catch (e) {
            // TODO Manejar error
            console.log(e);
            throw new DatabaseError('Error getting all incidences');
        }
    }

    static async getById({ id }) {

        try {

            const [incidence, tableInfo] = await conn.query(
                'SELECT *, BIN_TO_UUID(owner_id) AS owner_id FROM incidences WHERE id = ?', [id]);
            return incidence;

        } catch (e) {
            // TODO Manejar error
            console.log(e);
            throw new DatabaseError('Error getting incidence');
        }


    }

    static async create({ input }) {

        const {
            owner_id,
            brand,
            model,
            year,
            type,
            transmission,
            fuel_type,
            capacity,
            num_doors,
            daily_price,
        } = input;


        const existsOwner = await existOwner(owner_id);

        if(!existsOwner){
            return {
                success: false,
                message: 'Owner Id does not exist'
            };
        }


        const optionalFields = ["deposit", "availability", "registration_date"];
        const fields = [
            "owner_id", "brand", "model", "year", "type", "transmission",
            "fuel_type", "capacity", "num_doors", "daily_price"
        ];
        const values = [
            "UUID_TO_BIN(?)", "?", "?", "?", "?", "?",
            "?", "?", "?", "?"
        ];
        const params = [
            owner_id, brand, model, year, type, transmission,
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
            const query = `INSERT INTO incidences (${fields.join(", ")}) VALUES (${values.join(", ")})`;
            const [newIncidence] = await conn.query(query, params);

            const id = newIncidence.insertId;
            
            const incidenceUpdated = await IncidenceModel.getById({id});
        
            return { success: true, message: 'Incidence updated', incidence: incidenceUpdated };

        } catch (e) {
            console.log(e);
            //TODO: manejar error
            return {
                success: false,
                message: 'Incidence was not created'
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
                `UPDATE incidences SET ${fields.join(', ')} WHERE id = ?`, [...values, id]);

            if (result.affectedRows === 0) {
                return {
                    success: false,
                    message: 'No incidence found with the given ID'
                };
            }
        }catch(e){
            console.log(e);
            return {
                success: false,
                message: 'Error updating incidence'
            };
                //handlerDatabaseError({err: {message: 'Error updating incidence'}});
        }
            
        const incidenceUpdated = await IncidenceModel.getById({id});
        
        return { success: true, message: 'Incidence updated', incidence: incidenceUpdated };
        }


    static async delete({id}) {
        try {

            const res = await conn.query('DELETE FROM incidences WHERE id = ?', [id]);
            return res;
            
        } catch (e) {
            
            handlerDatabaseError({ err: { message: 'Error deleting incidence' } });
        }


    }

}




