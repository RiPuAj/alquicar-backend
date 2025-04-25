import { MediaModel } from "../models/mysql/media";
export class MediaController {
    constructor({ mediaModel }) {
        this.mediaModel = mediaModel;
    }
    create = async ( req, res ) => {
        const data = req.body;

        this.mediaModel.create();

    }
}