import { MediaModel } from "../models/mysql/media.js";
import { VehicleController } from "./vehicles.js";

export class MediaController {
	constructor({ mediaModel }) {
		this.mediaModel = mediaModel;
	}

	create = async (req, res) => {
		try {
			const data = req.body;
			const resp = await this.mediaModel.create({ input: data });
			return res.json(resp);
		} catch (e) {
			console.error(e);
			return res.status(500).json({ error: 'Error en la creación de media' });
		}
	}

	upload = async (req, res) => {
		try {
			const uuid = req.params.uuid;
			const vehicle_id = req.params.vehicle_id;
			const filename = req.generatedFilename;
			const imagePath = `assets/${uuid}/${filename}`;

			let resp;
			if (vehicle_id) {
				resp = await this.mediaModel.saveImagePath({ uuid, imagePath, vehicle_id });
			} else {
				resp = await this.mediaModel.saveImagePath({ uuid, imagePath });
			}

			return res.status(201).json({ message: 'Imagen guardada', data: resp });
		} catch (e) {
			console.error(e);
			return res.status(500).json({ error: 'Error al guardar la imagen' });
		}
	}

	modifyImage = async (req, res) => {
		try {
			const { uuid, vehicle_id } = req.params;
			console.log('UUID:', uuid);
			console.log('Vehicle ID:', vehicle_id);
			const filename = req.generatedFilename;
			const imagePath = `assets/${uuid}/${filename}`;

			let resp = await this.mediaModel.deleteImage({ uuid, vehicle_id });
			if (!resp.success) {
				return res.status(404).json({ error: 'Imagen no encontrada' });
			}
			resp = await this.mediaModel.saveImagePath({ uuid, imagePath, vehicle_id });

			return res.status(200).json({ message: 'Imagen modificada', data: resp });
		} catch (e) {
			console.error(e);
			return res.status(500).json({ error: 'Error al modificar la imagen' });
		}
	}

	modifyProfileImage = async (req, res) => {
		try {
			const { uuid } = req.params;
			const filename = req.generatedFilename;
			const imagePath = `assets/${uuid}/${filename}`;

			let resp = await this.mediaModel.deleteProfileImage({ uuid });
			if (!resp.success) {
				return res.status(404).json({ error: 'Imagen no encontrada' });
			}
			resp = await this.mediaModel.saveImagePath({ uuid, imagePath });

			return res.status(200).json({ message: 'Imagen modificada', data: resp });
		} catch (e) {
			console.error(e);
			return res.status(500).json({ error: 'Error al modificar la imagen' });
		}
	}


	getProfileImagesBase64 = async (req, res) => {
		try {
			const { uuid } = req.params;
			const images = await this.mediaModel.getProfileImagesBase64({ uuid });
			if (!images) {
				return res.status(404).json({ error: 'No se encontraron imágenes para este vehículo' });
			}
			return res.json(images);
		} catch (e) {
			console.error(e);
			return res.status(500).json({ error: 'Error al obtener imágenes de perfil' });
		}
	}

	getVehicleImagesBase64 = async (req, res) => {
		try {
			const { uuid, vehicle_id } = req.params;
			const images = await this.mediaModel.getVehicleImagesBase64({ uuid, vehicle_id });
			if (!images) {
				return res.status(404).json({ error: 'No se encontraron imágenes para este vehículo' });
			}
			return res.json(images);
		} catch (e) {
			console.error(e);
			return res.status(500).json({ error: 'Error al obtener imágenes del vehículo' });
		}
	}
}	
