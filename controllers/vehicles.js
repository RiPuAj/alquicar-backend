import{ validateVehicle, validatePartialVehicle } from '../utils/validators';

export class VehicleController {
    
    constructor({vehiclesModel}) {
        this.vehiclesModel = vehiclesModel;
    }

    getAll = async (req, res) => {
        try {
            const allVehicles = await this.vehiclesModel.getAll();
            return res.json(allVehicles);
        } catch (e) {
            if (e instanceof DatabaseError) {
                return res.status(500).json({ error: e.message });
            }
        }
    }

    getById = async (req, res) => {
        const { id } = req.params;
        try {
            const vehicle = await this.vehiclesModel.getById({ id });
            if (vehicle.length === 0) {
                return res.status(404).json({ error: 'Vehicle not found' });
            }
            return res.json(vehicle);
        } catch (e) {
            if (e instanceof DatabaseError) {
                return res.status(500).json({ error: e.message });
            }
        }
        
    }

    create = async (req, res) => {
        const vehicle = validateVehicle(req.body);
        if (!vehicle.success) {
            return res.status(400).json({ error: JSON.parse(vehicle.error.message) });
        }
        const newVehicle = await this.vehiclesModel.create({ input: vehicle.data });
        if (!newVehicle.success) {
            return res.status(400).json({ error: newVehicle.message });
        }
        res.status(201).json(newVehicle);
    }

    update = async (req, res) => {
        const { id } = req.params;
        const vehicle = validatePartialVehicle(req.body);
        if (!vehicle.success) {
            return res.status(400).json({ error: JSON.parse(vehicle.error.message) });
        }
        const updatedVehicle = await this.vehiclesModel.update({ id, input: vehicle.data });
        if (!updatedVehicle.success) {
            return res.status(400).json({ error: updatedVehicle.message });
        }
        res.json(updatedVehicle);
    }

    delete = async (req, res) => {
        const { id } = req.params;
        const deletedVehicle = await this.vehiclesModel.delete({ id });
        if (!deletedVehicle.success) {
            return res.status(400).json({ error: deletedVehicle.message });
        }
        res.json(deletedVehicle);
    }
}