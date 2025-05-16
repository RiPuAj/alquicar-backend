import { Router } from "express";
import { NotificationController } from "../controllers/notifications.js";

export const createNotificationRouter = ({ notificationModel }) => {

    const notificationRouter = Router();
    const notificationController = new NotificationController({ notificationModel });   

    notificationRouter.get("/:id", notificationController.getById);
    notificationRouter.post("/", notificationController.create);

    return notificationRouter;
}