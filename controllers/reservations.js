/* Description: Controller for Reservations
*  Methods: getAll, getById, create, update, delete
*  
*  Debe controlar los errores y devolver el status code correspondiente
*  Debe llamar a los métodos del modelo correspondientes
*/

import { DatabaseError } from "../errors/database-error.js";
import { ValidationError } from "../errors/validation-error.js";

export class ReservationController {
    constructor({ reservationModel }) {
        this.reservationModel = reservationModel;
    }

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
    }

    create = async (req, res) => {

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
        const { id } = req.params;
        try {
            const reservationModel = await this.reservationModel.delete({id});
            return res.json(reservationModel);
        } catch (error) {
            if (error instanceof ValidationError) {
                console.log("ERROR DE VALIDACION")
            } else if (error instanceof DatabaseError) {
                console.log("ERROR DE BASE DE DATOS")
            }
        }
    }

}