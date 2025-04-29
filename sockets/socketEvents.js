import { SocketsController } from "../controllers/socket.js";
import { authMiddlewareSocket } from "../middlewares/auth.js";


export const createSocketEvents = ({ io, socketModel }) => {
    const socketController = new SocketsController({ socketModel: socketModel })


    io.on("connection", (socket) => {
        console.log('Nuevo cliente conectado:', socket.id);
        //console.log(token);
        console.log("hola")
        //socketController.create({user_id: user_id, socket: socket});


        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });
}