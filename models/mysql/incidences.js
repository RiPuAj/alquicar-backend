import { handlerDatabaseError } from '../../errors/handler-error.js';
import { CreateMYSQLConnection } from './connectionCreater.js';



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

    static async getById({ id, requester }) {

        try {
            const [incidence, tableInfo] = await conn.query(
                'SELECT *, BIN_TO_UUID(from_id) AS from_id, BIN_TO_UUID(to_id) AS to_id FROM incidences WHERE id = ?', [id]);
            if(incidence[0].from_id === requester.id || incidence[0].to_id === requester.id || requester.role === 'admin'){
                return incidence;
            }else{
                return {
                    success: false,
                    message: 'Permiso denegado, debes ser administrador o parte de la incidencia'
                };
            }

        } catch (e) {
            // TODO Manejar error
            console.log(e);
            throw new DatabaseError('Error getting incidence');
        }


    }

    static async create({ input, issuer }) {

        const {
            from_id,
            to_id,
            reservation_id,
            description,
            type,
            status,
            created_at
        } = input;

        const query = `SELECT from_id, to_id incidences (${fields.join(", ")}) VALUES (${values.join(", ")})`;
        const [newIncidence] = await conn.query(query, params);

        if(issuer !== from_id && issuer !== to_id){
            return {
                success: false,
                message: 'Permiso denegado, debes ser el emisor o receptor de la incidencia'
            };
        }

        const optionalFields = ["to_id", "reservation_id", "created_at"];
        const fields = [
            "from_id", "description", "type", "status"
        ];
        
        const values = [
            "UUID_TO_BIN(?)", "?", "?", "?"
        ];
        
        const params = [
            from_id, description, type, status
        ];

        // Agregar los campos opcionales solo si están definidos
        optionalFields.forEach(field => {
            if (input[field] !== undefined) {
                fields.push(field);
                if (field === "to_id") {
                    values.push("UUID_TO_BIN(?)");
                } else {
                    values.push("?");
                }
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

        const fields = Object.keys(input).map(field => {
            if (field === "from_id" || field === "to_id") {
                return `${field} = UUID_TO_BIN(?)`;
            } else {
                return `${field} = ?`;
            }
        });
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




