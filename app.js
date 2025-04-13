import express from 'express';
import dotenv from 'dotenv';
import { createUserRouter } from './routes/users.js';
import { UserModel } from './models/mysql/users.js';
import { createReservationRouter } from './routes/reservations.js';
import { ReservationModel } from './models/mysql/reservations.js';
import { createVehicleRouter } from './routes/vehicles.js';
import { VehicleModel } from './models/mysql/vehicle.js';

dotenv.config({path: './.env'});

const app = express();
app.use(express.json());
app.disable('x-powered-by');

app.use('/users', createUserRouter({userModel: UserModel}));
app.use('/reservations', createReservationRouter({reservationModel: ReservationModel}));
app.use('/vehicles', createVehicleRouter({vehicleModel: VehicleModel}));


app.use((req, res) => {
    res.status(404).send('<h1>404 Not Found</h1>');
})


app.listen(3000, '0.0.0.0', () => {
    console.log('Server running');
  });