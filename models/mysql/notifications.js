import { CreateMYSQLConnection } from './connectionCreater.js';



const conn = await CreateMYSQLConnection.getConncetion();


export class NotificationModel {
    static async getById({ id }) {

        try {

            const [notifications, tableInfo] = await conn.query(
                'SELECT *, BIN_TO_UUID(user_id) AS user_id FROM notifications WHERE user_id = UUID_TO_BIN(?)', [id]);
            return notifications;

        } catch (e) {
            // TODO Manejar error
            console.log(e);
            throw new DatabaseError('Error getting notifications');
        }


    }
}