import { MediaModel } from "../models/mysql/media.js";
export class MediaController {
    constructor({ mediaModel }) {
        this.mediaModel = mediaModel;
    }
    create = async ( req, res ) => {
        const data = req.body;
        const resp = await this.mediaModel.create({ input: data });
        return res.json(resp);
        
    }
}