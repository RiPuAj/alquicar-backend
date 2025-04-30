import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { createUserRouter } from './routes/users.js';
import { UserModel } from './models/mysql/users.js';
import { createReservationRouter } from './routes/reservations.js';
import { ReservationModel } from './models/mysql/reservations.js';
import { createVehicleRouter } from './routes/vehicles.js';
import { VehicleModel } from './models/mysql/vehicle.js';
import { createAuthRouter } from './routes/auth.js';
import { createIncidenceRouter } from './routes/incidences.js';
import { IncidenceModel} from './models/mysql/incidences.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config({path: './.env'});

  
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
}));
app.disable('x-powered-by');
app.use(cors());

app.use('/users', createUserRouter({userModel: UserModel}));
app.use('/reservations', createReservationRouter({reservationModel: ReservationModel}));
app.use('/vehicles', createVehicleRouter({vehicleModel: VehicleModel}));
app.use('/auth', createAuthRouter({userModel: UserModel}));
app.use('/incidences', createIncidenceRouter({incidenceModel: IncidenceModel}))

app.use((req, res) => {
    res.status(404).send('<h1>404 Not Found</h1>');
})


http.createServer(app).listen(process.env.PORT, () => {
    console.log(`Servidor HTTP activo en http://localhost:${process.env.PORT_HTTP}`);
  });