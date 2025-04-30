import { MediaModel } from "../models/mysql/media.js";
import { VehicleController } from "./vehicles.js";
export class MediaController {
    constructor({ mediaModel }) {
        this.mediaModel = mediaModel;
    }
    create = async ( req, res ) => {
        const data = req.body;
        const resp = await this.mediaModel.create({ input: data });
        return res.json(resp);
        
    }
    upload = async (req, res) => {
        const uuid = req.params.uuid;
        const vehicle_id = req.params.vehicle_id;
        const filename = req.generatedFilename;
        const imagePath = `assets/${uuid}/${filename}`;
        let resp;
        try {
            if (vehicle_id){
                resp = await this.mediaModel.saveImagePath({ uuid, imagePath, vehicle_id});
            }else{
                resp = await this.mediaModel.saveImagePath({ uuid, imagePath });
            }
            return res.status(201).json({ message: 'Imagen guardada', data: resp });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ error: 'Error al guardar la imagen' });
        }
    };

    getProfileImagesBase64 = async (req, res) => {
        const { uuid } = req.params;
        const images = await this.mediaModel.getProfileImagesBase64({ uuid });
        return res.json(images);
    }

    getVehicleImagesBase64 = async (req, res) => {
        const { uuid, vehicle_id } = req.params;
        const images = await this.mediaModel.getVehicleImagesBase64({ uuid, vehicle_id });
        return res.json(images);
    }
}