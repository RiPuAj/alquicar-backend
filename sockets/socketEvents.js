import { SocketsController } from "../controllers/socket.js";
import { authMiddlewareSocket } from "../middlewares/auth.js";


export const createSocketEvents = ({ io, socketModel }) => {
    const socketController = new SocketsController({ socketModel: socketModel })


    io.on("connection", (socket) => {
        console.log('Nuevo cliente conectado:', socket.id);
    
        socketController.create({user_id: socket.user_info.id, socket_id: socket.id});

        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });
}