import{ validateNotification, validatePartialNotification} from '../schemas/notification.js';
import { UserModel } from '../models/mysql/users.js';
export class NotificationController {

    constructor({ notificationModel }){
        this.notificationModel = notificationModel;
    }

    getById = async (req, res) => {
        const { id } = req.params;
        try {
            const notifications = await this.notificationModel.getById({ id });
            if (notifications.length === 0) {
                return res.status(404).json({ error: 'User notifications not found' });
            }
            return res.json(notifications);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
        
    }


    create = async (req, res) => {
        const notification = validateNotification(req.body);
        if (!notification.success) {
            return res.status(400).json({ error: JSON.parse(notification.error.message) });
        }
        const newNotification = await this.notificationModel.create({ input: notification.data });
        if (!newNotification.success) {
            return res.status(400).json({ error: newNotification.message });
        }
        return res.status(201).json(newNotification);

    }

    update = async (req, res) => {
        const { id } = req.params;
        const notification = validatePartialNotification(req.body);
        if (!notification.success) {
            return res.status(400).json({ error: JSON.parse(notification.error.message) });
        }
        const updatedNotification = await this.notificationModel.update({ id, input: notification.data });
        if (!updatedNotification.success) {
            return res.status(400).json({ error: updatedNotification.message });
        }
        res.json(updatedNotification);
    }

}