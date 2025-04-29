import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import https from 'https';
import http from 'http';
import { createUserRouter } from './routes/users.js';
import { UserModel } from './models/mysql/users.js';
import { createReservationRouter } from './routes/reservations.js';
import { ReservationModel } from './models/mysql/reservations.js';
import { createVehicleRouter } from './routes/vehicles.js';
import { VehicleModel } from './models/mysql/vehicle.js';
import { createAuthRouter } from './routes/auth.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { WebSocketServerCreator } from './sockets/webSocketServerCreator.js';
import { createSocketEvents } from './sockets/socketEvents.js';
import { SocketsModel } from './models/mysql/sockets.js';
import { authMiddlewareSocket } from './middlewares/auth.js';
import { createMessagesEvents } from './sockets/messagesEvents.js';
import { MessagesModel } from './models/mysql/messages.js';

dotenv.config({ path: './.env' });

const options = {
  key: fs.readFileSync('backkey.pem'),
  cert: fs.readFileSync('backcert.pem')
}


const app = express();
app.use(express.json());
app.use(cookieParser());
app.disable('x-powered-by');
app.use(cors({
  origin: true,
  credentials: true, 
}));
app.use('/users', createUserRouter({ userModel: UserModel }));
app.use('/reservations', createReservationRouter({ reservationModel: ReservationModel }));
app.use('/vehicles', createVehicleRouter({ vehicleModel: VehicleModel }));
app.use('/auth', createAuthRouter({ userModel: UserModel }));

app.use((req, res) => {
  res.status(404).send('<h1>404 Not Found</h1>');
})


const server = https.createServer(options, app);

//const server = http.createServer(app);
const io = WebSocketServerCreator.createConnection({ server });
io.use(authMiddlewareSocket);
createSocketEvents({ io, socketModel: SocketsModel });
createMessagesEvents({ io, messagesModel: MessagesModel });

server.listen(process.env.PORT, () => {
  console.log(`Servidor HTTPS activo en https://localhost:${process.env.PORT}`);
});
