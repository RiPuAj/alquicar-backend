import { validateReservation, validatePartialReservation } from '../schemas/reservations.js';

export class ReservationController {

    constructor({ reservationModel }) {
        this.reservationModel = reservationModel;
    }


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

    }

    create = async (req, res) => {

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
}