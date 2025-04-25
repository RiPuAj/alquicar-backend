import { Router } from "express";
import { MediaModel } from "../models/mysql/media";
import { MediaController } from "../controllers/media";

export const createMediaRouter = ({ MediaModel }) => {
    const mediaRouter = Router();
    const mediaController = new MediaController({ MediaModel });
    mediaRouter.post("/create", mediaController.create());

    return mediaRouter;
}