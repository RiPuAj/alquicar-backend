import { VehiclesController } from "../controllers/vehicles.js";

export const createVehicleRouter = ({ vehiclesModel }) => {

    const vehicleRouter = Router();
    const vehicleController = new VehiclesController({ vehiclesModel });

    vehicleRouter.get("/", vehicleController.getAll);
    vehicleRouter.get("/:id", vehicleController.getById);
    vehicleRouter.post("/", vehicleController.create);
    vehicleRouter.patch("/:id", vehicleController.update);
    vehicleRouter.delete("/:id", vehicleController.delete);

    

    return vehicleController;
};