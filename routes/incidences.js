
import { Router } from "express";
import { IncidenceController } from "../controllers/incidences.js";

export const createIncidenceRouter = ({incidenceModel}) => {

    const incidenceRouter = Router();
    const incidenceController = new IncidenceController({incidenceModel});

    incidenceRouter.get("/", incidenceController.getAll);
    incidenceRouter.get("/:id", incidenceController.getById);
    incidenceRouter.post("/", incidenceController.create);
    incidenceRouter.patch("/:id", incidenceController.update);
    incidenceRouter.delete("/:id", incidenceController.delete);

    

    return incidenceRouter;
};