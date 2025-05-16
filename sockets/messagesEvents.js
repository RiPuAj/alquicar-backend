import { ChatController } from "../controllers/chat.js";
import { SocketsController } from "../controllers/socket.js";

export const createMessagesEvents = ({ io, chatModel, socketModel }) => {
    const chatController = new ChatController({ chatModel: chatModel });
    const socketController = new SocketsController({ socketModel: socketModel });
    const notificationController = new NotificationController({ notificationModel: notificationModel });

    io.on("connection", (socket) => {

        socket.on("get chats", async () => {
            console.log("get chats", socket.id);
            io.to(socket.id).emit("get chats", {
                chats: await chatController.getAllMyChats({ id: socket.user_info.id })
            });
        });

        socket.on("send message", async (data) => {
            const newMessage = {
                from_id: data.newMessage.from_id,
                to_id: data.newMessage.to_id,
                content: data.newMessage.content,
                created_at: data.newMessage.created_at,
                status: data.newMessage.status,
            }

            try {
                const result = await chatController.createMessage({ newMessage: newMessage })
                const socket = await socketController.getSocketIdByUserId({ id: data.newMessage.to_id });
                const message = await chatController.getMessageById({ id: result.insertId });

                if (!socket) return;
                io.to(socket.socket_id).emit("new message",
                    message
                );
            } catch (error) {
                console.log(error);
                socket.emit("error", { error: "Error al enviar el mensaje" });
            }
        });
    });

}