<<<<<<< HEAD
/* Description: Controller for Reservations
*  Methods: getAll, getById, create, update, delete
*  
*  Debe controlar los errores y devolver el status code correspondiente
*  Debe llamar a los métodos del modelo correspondientes
*/

import { DatabaseError } from "../errors/database-error.js";
import { ValidationError } from "../errors/validation-error.js";

export class ReservationController {
=======
import { validateReservation, validatePartialReservation } from '../schemas/reservations.js';

export class ReservationController {

>>>>>>> 190600066f9dbda46bdd5592b59c80c67bcfd693
    constructor({ reservationModel }) {
        this.reservationModel = reservationModel;
    }

<<<<<<< HEAD
    getAll = async (req, res) => {
        try {
            const reservations = await this.reservationModel.getAll();
            return res.json(reservations);
        } catch (error) {

            if (error instanceof ValidationError) {
                console.log("ERROR DE VALIDACION")
            } else if (error instanceof DatabaseError) {
                console.log("ERROR DE BASE DE DATOS")
            }
        }
    }

    getById = async (req, res) => {

        const { id } = req.params;

        try {

            const reservationModel = await this.reservationModel.getById({ id });
            return res.json(reservationModel);

        } catch (error) {
            if (error instanceof ValidationError) {
                console.log("ERROR DE VALIDACION")
            } else if (error instanceof DatabaseError) {
                console.log("ERROR DE BASE DE DATOS")
            }
        }
=======

    getAll = async (req, res) => {

        try{
            const allReservations = await this.reservationModel.getAll();
            return res.json(allReservations);
        } catch (e) {
            return res.status(500).json({ error: e.message });
            /*
            if (e instanceof DatabaseError) {
                return res.status(500).json({ error: e.message });
            }*/
        }

    }

    getById = async (req, res) => {
        const { id } = req.params;
        
        try{
        
            const reservation = await this.reservationModel.getById({ id });
            
            if (reservation.length === 0) {
                return res.status(404).json({ error: 'Reservation not found' });
            }
            
            return res.json(reservation);
        } catch (e) {
            
            if (e instanceof DatabaseError) {
                return res.status(500).json({ error: e.message });
            }

            console.log(e);
        }

>>>>>>> 190600066f9dbda46bdd5592b59c80c67bcfd693
    }

    create = async (req, res) => {

<<<<<<< HEAD
        try {

            const reservationModel = await this.reservationModel.create({ input: req.body });
            return res.json(reservationModel);

        } catch (error) {
            if (error instanceof ValidationError) {
                console.log("ERROR DE VALIDACION")
            } else if (error instanceof DatabaseError) {
                console.log("ERROR DE BASE DE DATOS")
            }
            console.log(error);
            return res.status(400).json({ error: error.message });
        }
    }

    update = async (req, res) => {

        const { id } = req.params;

        try {

            const reservationModel = await this.reservationModel.update({ id, input: req.body });
            return res.json(reservationModel);

        } catch (error) {
            // TODO ERRORES
            if (error instanceof ValidationError) {
                return res.status(400).json({ error: error.message });
            } else if (error instanceof DatabaseError) {
                return res.status(400).json({ error: error.message });
            } else {
                return res.status(500).json({ error: "Ha ocurrido un error fatal" });
            }
        }
    }

    delete = async (req, res) => {
        try {
            const reservationModel = await this.reservationModel.delete(req.params.id);
            return res.json(reservationModel);
        } catch (error) {
            if (error instanceof ValidationError) {
                console.log("ERROR DE VALIDACION")
            } else if (error instanceof DatabaseError) {
                console.log("ERROR DE BASE DE DATOS")
            }
        }
    }

=======
        const reservation = validateReservation(req.body);

        if (!reservation.success) {
            return res.status(400).json({ error: JSON.parse(reservation.error.message) });
        }

        const newReservation = await this.reservationModel.create({ input: reservation.data });

        if (!newReservation.success) {
            return res.status(400).json({ error: newReservation.message });
        }

        res.status(201).json(newReservation);

    }

    update = async (req, res) => {
        const result = validatePartialReservation(req.body)

        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }

        const { id } = req.params

        const reservation = await this.reservationModel.update({ id, input: result.data })

        if (!reservation) {
            return res.status(404).json({ error: 'Error updating reservation' })
        }

        res.status(201).json(reservation);

    }

    delete = async (req, res) => {
        const { id } = req.params;

        const result = await this.reservationModel.delete({ id });

        if (result[0].affectedRows === 0) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        res.status(201).json({ message: 'Reservation deleted' });
    }
>>>>>>> 190600066f9dbda46bdd5592b59c80c67bcfd693
}