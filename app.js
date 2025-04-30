import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { WebSocketServerCreator } from './sockets/webSocketServerCreator.js';
import { createSocketEvents } from './sockets/socketEvents.js';
import { SocketsModel } from './models/mysql/sockets.js';
import { authMiddlewareSocket } from './middlewares/auth.js';
import { createMessagesEvents } from './sockets/messagesEvents.js';
import { MessagesModel } from './models/mysql/messages.js';

import {
  createUserRouter,
  createReservationRouter,
  createVehicleRouter,
  createAuthRouter,
  createIncidenceRouter
} from './routes/index.js';

import {
  UserModel,
  ReservationModel,
  VehicleModel,
  IncidenceModel
} from './models/mysql/index.js';

dotenv.config({ path: './.env' });


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.disable('x-powered-by');

app.use('/users', createUserRouter({ userModel: UserModel }));
app.use('/reservations', createReservationRouter({ reservationModel: ReservationModel }));
app.use('/vehicles', createVehicleRouter({ vehicleModel: VehicleModel }));
app.use('/auth', createAuthRouter({ userModel: UserModel }));
app.use('/incidences', createIncidenceRouter({ incidenceModel: IncidenceModel }))

app.use((req, res) => {
  res.status(404).send('<h1>404 Not Found</h1>');
})



const server = http.createServer(app);
const io = WebSocketServerCreator.createConnection({ server });
io.use(authMiddlewareSocket);
createSocketEvents({ io, socketModel: SocketsModel });
createMessagesEvents({ io, messagesModel: MessagesModel });

server.listen(process.env.PORT, () => {
  console.log(`Servidor HTTPS activo en https://localhost:${process.env.PORT}`);
});
