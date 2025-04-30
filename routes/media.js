import { Router } from "express";
import { MediaModel } from "../models/mysql/media.js";
import { MediaController } from "../controllers/media.js";
import { upload } from "../middlewares/upload.js";


export const createMediaRouter = ({ mediaModel }) => {
    const mediaRouter = Router();
    const mediaController = new MediaController({ mediaModel });
    mediaRouter.post("/create", mediaController.create);
    mediaRouter.post('/upload/:uuid/:vehicle_id', upload.single('image'), mediaController.upload);
    mediaRouter.get('/profile/:uuid', mediaController.getProfileImagesBase64);
    mediaRouter.get('/vehicles/:uuid/:vehicle_id', mediaController.getVehicleImagesBase64);
    return mediaRouter;
}