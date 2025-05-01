import { CreateMYSQLConnection } from "./connectionCreater.js";
import { handlerDatabaseError } from "../../errors/handler-error.js";
import { DatabaseError } from "../../errors/database-error.js";

const conn = await CreateMYSQLConnection.getConncetion();


export class ChatModel {

    static async getAllMyChatsAsCustomer({ id }) {
        const query = `SELECT BIN_TO_UUID(v.owner_id) as contact_id, u.name AS contact_name 
        FROM reservations r 
        JOIN vehicles v ON v.id = r.vehicle_id
        JOIN users u ON u.id = v.owner_id
        WHERE BIN_TO_UUID(r.customer_id) = ?;`;
        try{
            const [result] = await conn.query(query, [id]);
            console.log({contact: result});
            return result;
        } catch (error) {
            // TODO Manejar error
            console.log(error);
            handlerDatabaseError({error: new DatabaseError('No se pudo obtener los chats')});
        }
    }
}