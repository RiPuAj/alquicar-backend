import { CreateMYSQLConnection } from './connectionCreater.js';



const conn = await CreateMYSQLConnection.getConncetion();


export class NotificationModel {

    static async getById({ id }) {

        try {

            const [notification, tableInfo] = await conn.query(
                'SELECT *, BIN_TO_UUID(user_id) AS user_id FROM notifications WHERE id = ?', [id]);
            return notification;

        } catch (e) {
            // TODO Manejar error
            console.log(e);
            return { success: false, message: 'Notification not found' };
        }


    }

    static async getUserNotifications({ id }) {

        try {

            const [notifications, tableInfo] = await conn.query(
                'SELECT *, BIN_TO_UUID(user_id) AS user_id FROM notifications WHERE user_id = UUID_TO_BIN(?) AND seen = false', [id]);
            return notifications;

        } catch (e) {
            // TODO Manejar error
            console.log(e);
            return { success: false, message: 'Notifications not found' };
        }


    }

    static async create({ input }) {

        const {
            user_id,
            type, 
            content
        } = input;

        const optionalFields = ["seen", "created_at"];
        const fields = [
            "user_id", "type", "content"
        ];
        const values = [
            "UUID_TO_BIN(?)", "?", "?"
        ];
        const params = [
            user_id, type, content
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
            

            const query = `INSERT INTO notifications (${fields.join(", ")}) VALUES (${values.join(", ")})`;
            const [newNotification] = await conn.query(query, params);
            const result = await this.getById({ id: newNotification.insertId });

            return { success: true, message: 'Notification added', notification: result };

        } catch (e) {

            console.log(e);
            return { success: false, message: 'Notification not added' };
        }
    }

    static async update({id, input}){

        const fields = Object.keys(input).map(field => 
            field === "user_id" ? `${field} = UUID_TO_BIN(?)` : `${field} = ?`
        );
        const values = Object.values(input);

        if (fields.length === 0) {
            return {
                success: false,
                message: 'No fields provided for update'
            };
        }

        try{
            const [result] = await conn.query(
                `UPDATE notifications SET ${fields.join(', ')} WHERE id = ?`, [...values, id]);

            if (result.affectedRows === 0) {
                return {
                    success: false,
                    message: 'No notification found with the given ID'
                };
            }
            return { success: true, message: 'Notification updated', notification: result };
        }catch(e){
            console.log(e);
            return {
                success: false,
                message: 'Error updating notification'
            };
        }

    }



}