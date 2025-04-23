import{ validateIncidence, validatePartialIncidence } from '../schemas/incidences.js';

export class IncidenceController {
    
    constructor({incidenceModel}) {
        this.incidenceModel = incidenceModel;
    }

    getAll = async (req, res) => {
        try {
            const allIncidences = await this.incidenceModel.getAll();
            return res.json(allIncidences);
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
            const incidence = await this.incidenceModel.getById({ id });
            if (incidence.length === 0) {
                return res.status(404).json({ error: 'Incidence not found' });
            }
            return res.json(incidence);
        } catch (e) {
            return res.status(500).json({ error: e.message });
            /*
            if (e instanceof DatabaseError) {
                return res.status(500).json({ error: e.message });
            }*/
        }
        
    }

    create = async (req, res) => {
        const incidence = validateIncidence(req.body);
        if (!incidence.success) {
            return res.status(400).json({ error: JSON.parse(incidence.error.message) });
        }
        const newIncidence = await this.incidenceModel.create({ input: incidence.data });
        if (!newIncidence.success) {
            return res.status(400).json({ error: newIncidence.message });
        }
        return res.status(201).json(newIncidence);

    }

    update = async (req, res) => {
        const { id } = req.params;
        const incidence = validatePartialIncidence(req.body);
        if (!incidence.success) {
            return res.status(400).json({ error: JSON.parse(incidence.error.message) });
        }
        const updatedIncidence = await this.incidenceModel.update({ id, input: incidence.data });
        if (!updatedIncidence.success) {
            return res.status(400).json({ error: updatedIncidence.message });
        }
        res.json(updatedIncidence);
    }

    delete = async (req, res) => {
        const { id } = req.params;
        const deletedIncidence = await this.incidenceModel.delete({ id });
        if (deletedIncidence[0].affectedRows === 0) {
            return res.status(404).json({ error: 'Incidence not found' });
        }
        res.status(201).json({ message: 'Incidence deleted' });
    }
}