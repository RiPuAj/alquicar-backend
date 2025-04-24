import { Router } from "express";
import { VehicleController } from "../controllers/vehicles.js";

export const createVehicleRouter = ({ vehicleModel }) => {

    const vehicleRouter = Router();
    const vehicleController = new VehicleController({ vehicleModel });

    vehicleRouter.get("/", vehicleController.getAll);
    vehicleRouter.get("/:id", vehicleController.getById);
    vehicleRouter.post("/", vehicleController.create);
    vehicleRouter.post("/publish", vehicleController.publish)
    vehicleRouter.patch("/:id", vehicleController.update);
    vehicleRouter.delete("/:id", vehicleController.delete);

    

    return vehicleRouter;
};