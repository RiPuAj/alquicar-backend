import { SocketsController } from "../controllers/socket.js";
import { NotificationController } from "../controllers/notifications.js";

export const createNotificationsEvents = ({ io, socketModel, notificationModel }) => {
    const socketController = new SocketsController({ socketModel: socketModel });
    const notificationController = new NotificationController({ notificationModel: notificationModel });

    io.on("connection", (socket) => {

        socket.on("get notifications", async () => {
            io.to(socket.id).emit("get notifications", {
                notifications: await notificationController.getUserNotifications({ id: socket.user_info.id })
            });
        });

        socket.on("read notification", async (data) => {
            io.to(socket.id).emit("read notification", {
                notifications: await notificationController.update({ id: data.id, input: { seen: true } })
            });
        });

    });

}