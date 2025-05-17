import{ validateNotification, validatePartialNotification} from '../schemas/notification.js';
export class NotificationController {

    constructor({ notificationModel }){
        this.notificationModel = notificationModel;
    }

    getById = async ({ id }) => {
        try {
            const notifications = await this.notificationModel.getById({ id });
            if (notifications.length === 0) {
                return {error: JSON.parse('User notifications not found')};
            }
            return JSON.parse(notifications);
        } catch (e) {
            throw new Error('Error getting notifications');
        }
        
    }


    create = async ({ input }) => {
        const notification = validateNotification(input);
        if (!notification.success) {
            return {error: JSON.parse(notification.message)};
        }
        const newNotification = await this.notificationModel.create({ input: notification.data });
        if (!newNotification.success) {
            return {error: JSON.parse(newNotification.message)};
        }
        return JSON.parse(newNotification);

    }

    update = async ({ id, input }) => {
        const notification = validatePartialNotification(input);
        if (!notification.success) {
            return {error: JSON.parse(notification.message)};
        }
        const updatedNotification = await this.notificationModel.update({ id, input: notification.data });
        if (!updatedNotification.success) {
            return { error: JSON.parse(updatedNotification.message) };
        }
        return JSON.parse(updatedNotification);
    }

}