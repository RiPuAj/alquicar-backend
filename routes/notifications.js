import { Router } from "express";
import { NotificationController } from "../controllers/notifications.js";

export const createNotificationRouter = ({ notificationModel }) => {

    const notificationRouter = Router();
    const notificationController = new NotificationController({ notificationModel });   

    notificationRouter.get("/:id", notificationController.getById);
    notificationRouter.post("/:id", notificationController.create);

    return notificationRouter;
}