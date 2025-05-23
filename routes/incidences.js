
import { Router } from "express";
import { IncidenceController } from "../controllers/incidences.js";
import { authMiddleware } from "../middlewares/auth.js";
import { adminMiddleware, adminOrSelfMiddleware } from "../middlewares/admin.js";

export const createIncidenceRouter = ({incidenceModel, notificationModel}) => {

    const incidenceRouter = Router();
    const incidenceController = new IncidenceController({incidenceModel, notificationModel});

    incidenceRouter.get("/", [authMiddleware, adminMiddleware], incidenceController.getAll);
    incidenceRouter.get("/my-incidences", incidenceController.getMyIncidences);
    incidenceRouter.get("/:id", incidenceController.getById);
    incidenceRouter.post("/", incidenceController.create);
    incidenceRouter.patch("/:id", incidenceController.update);
    incidenceRouter.delete("/:id", incidenceController.delete);

    

    return incidenceRouter;
};