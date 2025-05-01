import { Router } from 'express';
import { ReservationController } from '../controllers/reservations.js';

export const createReservationRouter = ({ reservationModel }) => {

    const reservationRouter = Router();
    const reservationController = new ReservationController({ reservationModel });

    reservationRouter.get("/", reservationController.getAll);
    reservationRouter.get("/customer", reservationController.getMyReservations);
    reservationRouter.get("/vehicle/:id", reservationController.getByVehicleId);
    reservationRouter.get("/:id", reservationController.getById);
    reservationRouter.post("/", reservationController.create);
    reservationRouter.patch("/:id", reservationController.update);
    reservationRouter.delete("/:id", reservationController.delete);
    
    //reservationRouter.get("/customer/:id", reservationController.getByCustomerId);
    

    return reservationRouter;
}
