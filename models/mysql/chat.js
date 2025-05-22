import { CreateMYSQLConnection } from "./connectionCreater.js";
import { handlerDatabaseError } from "../../errors/handler-error.js";
import { DatabaseError } from "../../errors/database-error.js";
import { validateMessage } from "../../schemas/message.js";
import { changeDateFormat } from "../../utils/changeDateFormat.js";

const conn = await CreateMYSQLConnection.getConncetion();


export class ChatModel {

    static async getAllMyChatsAsCustomer({ id }) {
        const query = `SELECT DISTINCT BIN_TO_UUID(v.owner_id) as contact_id, u.name AS contact_name 
        FROM reservations r 
        JOIN vehicles v ON v.id = r.vehicle_id
        JOIN users u ON u.id = v.owner_id
        WHERE BIN_TO_UUID(r.customer_id) = ?;`;
        try {
            const [contacts] = await conn.query(query, [id]);

            const chatsWithMessages = await Promise.all(contacts.map(async (contact) => {
                const messages = await this.getMessagesFromChat({ id, contact_id: contact.contact_id });
                return {
                    ...contact,
                    messages: messages
                };
            }));

            return chatsWithMessages;
        } catch (error) {
            // TODO Manejar error
            console.log(error);
            handlerDatabaseError({ error: new DatabaseError('No se pudo obtener los chats') });
        }
    }

    static async getAllMyChatsAsOwner({ id }) {

        const query = `SELECT DISTINCT BIN_TO_UUID(r.customer_id) as contact_id, u.name AS contact_name
        FROM reservations r
        JOIN vehicles v ON v.id = r.vehicle_id
        JOIN users u ON u.id = r.customer_id
        WHERE BIN_TO_UUID(v.owner_id) = ?;`;

        try {
            const [contacts] = await conn.query(query, [id]);

            const chatsWithMessages = await Promise.all(contacts.map(async (contact) => {
                const messages = await this.getMessagesFromChat({ id, contact_id: contact.contact_id });
                return {
                    ...contact,
                    messages: messages
                };
            }));

            return chatsWithMessages;
        } catch (error) {
            // TODO Manejar error
            console.log(error);
            handlerDatabaseError({ error: new DatabaseError('No se pudo obtener los chats') });
        }
    }

    static async getMessagesFromChat({ id, contact_id }) {
        const query = `SELECT m.content as content, m.created_at as created_at, m.status as status, BIN_TO_UUID(m.from_id) as from_id, BIN_TO_UUID(m.to_id) as to_id, u.name AS sender_name, u2.name AS receiver_name
            FROM messages m
            JOIN users u ON u.id = m.from_id
            JOIN users u2 ON u2.id = m.to_id
            WHERE (m.from_id = UUID_TO_BIN(?) AND m.to_id = UUID_TO_BIN(?)) OR (m.from_id = UUID_TO_BIN(?) AND m.to_id = UUID_TO_BIN(?))
            ORDER BY m.created_at ASC;`;

            
        try {
            const [result] = await conn.query(query, [contact_id, id, id, contact_id]);
            return result;
        } catch (error) {
            // TODO Manejar error
            console.log(error);
            handlerDatabaseError({ error: new DatabaseError('No se pudo obtener los mensajes') });
        }

    }

    static async createMessage({ newMessage }) {
        const validationMessage = validateMessage(newMessage);
        if (!validationMessage.success) {
            return
        }

        const lockedFields = ['from_id', 'to_id', 'content'];
        const optionalFieldsQuery = getOptionalFields(newMessage, lockedFields);


        const optionalValues = optionalFieldsQuery.optionalFields
            .split(',')
            .filter((field) => field.trim() !== '')
            .map((field) => {
                const fieldName = field.split('=')[0].trim();
                if (fieldName === 'created_at') return changeDateFormat(newMessage.created_at);
                return newMessage[fieldName];
            })
        const query = `INSERT INTO messages (${optionalFieldsQuery.optionalFields} from_id, to_id, content) 
            VALUES (${optionalFieldsQuery.valuesToInsert} UUID_TO_BIN(?), UUID_TO_BIN(?), ?);`;

        const values = [...optionalValues, newMessage.from_id, newMessage.to_id, newMessage.content];
        try {
            const [result] = await conn.query(query, values);
            return result;
        } catch (error) {
            // TODO Manejar error
            console.log(error);
            handlerDatabaseError({ error: new DatabaseError('No se pudo crear el mensaje') });
        }
    }

    static async getMessageById({ id }) {
        try {

            const [message, tableInfo] = await conn.query(
                `SELECT m.content as content, m.created_at as created_at, m.status as status, BIN_TO_UUID(m.from_id) as from_id, BIN_TO_UUID(m.to_id) as to_id, u.name AS sender_name, u2.name AS receiver_name 
                FROM messages m 
                JOIN users u ON u.id = m.from_id
                JOIN users u2 ON u2.id = m.to_id
                WHERE m.id = ?`, [id]);
            return message;

        } catch (e) {
            // TODO Manejar error
            console.log(e);
            handlerDatabaseError({ error: new DatabaseError('Error getting user') });
        }
    }
}


const getOptionalFields = (input, lockedFields) => {
    const fields = Object.keys(input);
    const values = Object.values(input);

    const optionalFields = fields
        .filter(field => !lockedFields.includes(field))
        .map((field, index) => {
            return `${field}`
        })
        .join(', ');

    const valuesToInsert = optionalFields
        .split(', ')
        .map((field) => {
            return '?';
        }).join(', ');

    return {
        optionalFields: optionalFields.concat(', '),
        valuesToInsert: valuesToInsert.concat(', '),
    }
}