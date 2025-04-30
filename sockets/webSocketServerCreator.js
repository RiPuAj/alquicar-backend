import { Server } from "socket.io";
import dotenv from "dotenv";
import { corsConfig } from "../config/corsConfig.js";

dotenv.config({ path: './.env' });

export class WebSocketServerCreator {
    static webSocketServer = null;

    static createConnection({server}) {
        console.log(this.webSocketServer)
        if (!this.webSocketServer) {
            this.webSocketServer = new Server(server, {
                cors: corsConfig,
            });
        }
        return this.webSocketServer;
    }
}