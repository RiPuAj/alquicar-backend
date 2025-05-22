import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config({ path: './.env' });

export class WebSocketServerCreator {
    static webSocketServer = null;

    static createConnection({server}) {
        console.log(this.webSocketServer)
        if (!this.webSocketServer) {
            this.webSocketServer = new Server(server,{
                cors: {
                    origin: 'http://localhost:8081',
                    methods: ["GET", "POST"],
                    credentials: true,
                },
            });
        }
        return this.webSocketServer;
    }


    static getConnection() {
        return this.webSocketServer;
    }
}