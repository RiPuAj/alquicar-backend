<<<<<<< HEAD
import { Router } from 'express';
import { ReservationController } from '../controllers/reservations.js';

export const createReservationRouter = ({reservationModel}) => {
    
=======
import { Router } from "express";
import { ReservationController } from "../controllers/reservations.js";

export const createReservationRouter = ({reservationModel}) => {

    console.log("Reservation router initialized");

>>>>>>> 190600066f9dbda46bdd5592b59c80c67bcfd693
    const reservationRouter = Router();
    const reservationController = new ReservationController({reservationModel});

    reservationRouter.get("/", reservationController.getAll);
    reservationRouter.get("/:id", reservationController.getById);
    reservationRouter.post("/", reservationController.create);
    reservationRouter.patch("/:id", reservationController.update);
    reservationRouter.delete("/:id", reservationController.delete);
<<<<<<< HEAD
    
    return reservationRouter;
}
=======

    

    return reservationRouter;
};
>>>>>>> 190600066f9dbda46bdd5592b59c80c67bcfd693
