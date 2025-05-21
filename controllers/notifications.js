import{ validateNotification, validatePartialNotification} from '../schemas/notification.js';
export class NotificationController {

    constructor({ notificationModel }){
        this.notificationModel = notificationModel;
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
            return { success: false, error: notification.error };
        }
        const newNotification = await this.notificationModel.create({ input: notification.data });
        if (!newNotification.success) {
            return { success: false, error: newNotification.message };
        }
        console.log(newNotification.creator);
        return { success: true, notification: newNotification.notification, creator: newNotification.creator };

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