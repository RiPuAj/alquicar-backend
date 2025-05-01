/* Description: Controller for Reservations
*  Methods: getAll, getById, create, update, delete
*  
*  Debe controlar los errores y devolver el status code correspondiente
*  Debe llamar a los métodos del modelo correspondientes
*/
import { getTokenInfo } from "../utils/tokens.js";
import { catchAndResponseError } from "../errors/handler-error.js";


export class ReservationController {
    constructor({ reservationModel }) {
        this.reservationModel = reservationModel;
    }

    getAll = async (req, res) => {
        try {
            const reservations = await this.reservationModel.getAll();
            return res.json(reservations);
        } catch (error) {

            return catchAndResponseError(error, res);
        }
    }

    getById = async (req, res) => {

        const { id } = req.params;

        try {

            const reservationModel = await this.reservationModel.getById({ id });
            return res.json(reservationModel);

        } catch (error) {
            return catchAndResponseError(error, res);
        }
    }

    create = async (req, res) => {

        try {

            const reservationModel = await this.reservationModel.create({ input: req.body });
            return res.json(reservationModel);

        } catch (error) {
            return catchAndResponseError(error, res);
        }
    }

    update = async (req, res) => {

        const { id } = req.params;

        try {

            const reservationModel = await this.reservationModel.update({ id, input: req.body });
            return res.json(reservationModel);

        } catch (error) {
            // TODO ERRORES
            return catchAndResponseError(error, res);
        }
    }

    delete = async (req, res) => {
        const { id } = req.params;
        try {
            const reservationModel = await this.reservationModel.delete({ id });
            return res.json(reservationModel);
        } catch (error) {
            return catchAndResponseError(error, res);
        }
    }

    getByVehicleId = async (req, res) => {
        const { id } = req.params;
        try {
            const reservationModel = await this.reservationModel.getReservationsByVehicle({ idVehicle: id });
            return res.json(reservationModel);
        } catch (error) {
            return catchAndResponseError(error, res);
        }
    }

    getByCustomerId = async (req, res) => {
        const { id } = req.params;
        try {
            const reservationModel = await this.reservationModel.getReservationsByCustomer({ idCustomer: id });
            return res.json(reservationModel);
        } catch (error) {
            return catchAndResponseError(error, res);
        }
    }


    getMyReservations = async (req, res) => {
        const token = req.cookies.access_token;


        if (!token) {
            return res.status(400).json({ message: 'Token no proporcionado' });
        }

        const tokenInfo = getTokenInfo(token);
        try {
            const reservationModel = await this.reservationModel.getReservationsByCustomer({ idCustomer: tokenInfo.id });

            return res.json(reservationModel);
        } catch (error) {
            return catchAndResponseError(error, res);
        }
    }

}