import{ validateVehicle, validatePartialVehicle } from '../schemas/vehicle.js';

export class VehicleController {
    
    constructor({vehicleModel}) {
        this.vehicleModel = vehicleModel;
    }

    getAll = async (req, res) => {
        try {
            const allVehicles = await this.vehicleModel.getAll();
            return res.json(allVehicles);
        } catch (e) {
            return res.status(500).json({ error: e.message });
            /*if (e instanceof DatabaseError) {
                return res.status(500).json({ error: e.message });
            }*/
        }
    }

    getById = async (req, res) => {
        const { id } = req.params;
        try {
            const vehicle = await this.vehicleModel.getById({ id });
            if (vehicle.length === 0) {
                return res.status(404).json({ error: 'Vehicle not found' });
            }
            return res.json(vehicle);
        } catch (e) {
            return res.status(500).json({ error: e.message });
            /*
            if (e instanceof DatabaseError) {
                return res.status(500).json({ error: e.message });
            }*/
        }
        
    }

    create = async (req, res) => {
        const vehicle = validateVehicle(req.body);
        if (!vehicle.success) {
            return res.status(400).json({ error: JSON.parse(vehicle.error.message) });
        }
        const newVehicle = await this.vehicleModel.create({ input: vehicle.data });
        if (!newVehicle.success) {
            return res.status(400).json({ error: newVehicle.message });
        }
        return res.status(201).json(newVehicle);

    }

    update = async (req, res) => {
        const { id } = req.params;
        const vehicle = validatePartialVehicle(req.body);
        if (!vehicle.success) {
            return res.status(400).json({ error: JSON.parse(vehicle.error.message) });
        }
        const updatedVehicle = await this.vehicleModel.update({ id, input: vehicle.data });
        if (!updatedVehicle.success) {
            return res.status(400).json({ error: updatedVehicle.message });
        }
        res.json(updatedVehicle);
    }

    delete = async (req, res) => {
        const { id } = req.params;
        const deletedVehicle = await this.vehicleModel.delete({ id });
        if (deletedVehicle[0].affectedRows === 0) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        res.status(201).json({ message: 'Vehicle deleted' });
    }
}