import { Router } from "express";
import { MediaModel } from "../models/mysql/media.js";
import { MediaController } from "../controllers/media.js";

export const createMediaRouter = ({ mediaModel }) => {
    const mediaRouter = Router();
    const mediaController = new MediaController({ mediaModel });
    mediaRouter.post("/create", mediaController.create);

    return mediaRouter;
}