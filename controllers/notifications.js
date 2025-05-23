import { validateNotification, validatePartialNotification } from '../schemas/notification.js';
import { formatDate } from '../utils/formatDate.js';
import { WebSocketServerCreator } from '../sockets/webSocketServerCreator.js';
import { SocketsController } from '../controllers/socket.js';
import { SocketsModel } from '../models/mysql/sockets.js';
export class NotificationController {

    constructor({ notificationModel }) {
        this.notificationModel = notificationModel;
        this.socketsController = new SocketsController({ socketModel: SocketsModel });
    }

    getById = async ({ id }) => {
        try {
            const notification = await this.notificationModel.getById({ id });
            if (notification.length === 0) {
                return { success: false, error: notification.message };
            }
            return { success: true, notification: JSON.parse(notification) };
        } catch (e) {
            console.log(e);
            throw new Error('Error getting notifications');
        }

    }

    getUserNotifications = async ({ id }) => {
        try {
            const notifications = await this.notificationModel.getUserNotifications({ id });
            return notifications;
        } catch (e) {
            throw new Error('Error getting notifications');
        }

    }


    create = async ({ input }) => {
        const notification = validateNotification(input);
        if (!notification.success) {
            console.log(notification.error);
            return { success: false, error: notification.error };
        }
        const newNotification = await this.notificationModel.create({ input: notification.data });
        if (!newNotification.success) {
            return { success: false };
        }
        return { success: true, notification: newNotification.notification };

    }

    createFromReservation = async ({ input }) => {
        try {
            const infoNotification = await this.notificationModel.getNotificationInfoFromReservation({ input: input });
            
            const notificationContent = {
                user_id: infoNotification[0].user_id,
                content: `Su vehículo ${infoNotification[0].vehicle_brand} ${infoNotification[0].vehicle_model} ha sido reservado desde el ${formatDate(infoNotification[0].start_date)} hasta el ${formatDate(infoNotification[0].end_date)}`,
                type: 'Reservation'
            };

            const notificationCreation = await this.create({ input: notificationContent });            

            const socket = await this.socketsController.getSocketIdByUserId({ id: notificationCreation.notification[0].user_id });
        
            const io = WebSocketServerCreator.getConnection();
            io.to(socket.socket_id).emit("new notification", notificationCreation.notification);
            


        } catch (e) {
            console.log(e);
            return { success: false };

        }

    }

    createFromUpdatingIncidence = async ({ input }) => {
        const incidencesStates = {
            "Pending": "Pendiente",
            "In Review": "En revisión",
            "Resolved": "Resuelta",
            "Dismissed": "Desestimada"
        }
        try {
            console.log("INPUT EN INCIDENCIA",input.incidence[0].id);
            const notificationContent = {
                user_id: input.incidence[0].from_id,
                content: `Su incidencia con ID ${input.incidence[0].id} ha sido actualizada con el estado ${incidencesStates[input.incidence[0].status]}`,
                type: 'Incidence'
            };
            
            const notificationCreation = await this.create({ input: notificationContent });

            const socket = await this.socketsController.getSocketIdByUserId({ id: notificationCreation.notification[0].user_id });

            const io = WebSocketServerCreator.getConnection();
            io.to(socket.socket_id).emit("new notification", notificationCreation.notification);
    
        } catch (e) {
            console.log(e);
            return { success: false };

        }
    }

    update = async ({ id, input }) => {
        const notification = validatePartialNotification(input);
        if (!notification.success) {
            return { success: false, error: notification.message };
        }
        const updatedNotification = await this.notificationModel.update({ id, input: notification.data });
        if (!updatedNotification.success) {
            return { success: false, error: notification.message };
        }
        return { success: true, notification: updatedNotification.notification };
    }

}