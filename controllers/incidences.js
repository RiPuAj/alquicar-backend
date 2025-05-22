import{ validateIncidence, validatePartialIncidence } from '../schemas/incidences.js';
import { getTokenInfo } from '../utils/tokens.js';
import { NotificationController } from './notifications.js';

export class IncidenceController {
    
    constructor({incidenceModel, notificationModel}) {
        this.incidenceModel = incidenceModel;
        this.notificationController = new NotificationController({ notificationModel: notificationModel });
    }

    getAll = async (req, res) => {
        try {
            
            const allIncidences = await this.incidenceModel.getAll();
            return res.json(allIncidences);
        } catch (e) {
            return res.status(500).json({ error: e.message });

        }
    }

    getMyIncidences = async (req, res) => {
        try {
            const requester = getTokenInfo(req.cookies.access_token);
            const myIncidences = await this.incidenceModel.getMyIncidences({ requester });
            if (myIncidences.length === 0) {
                return res.status(404).json({ error: 'User has no incidences' });
            }
            return res.json(myIncidences);
        } catch (e) {
            return res.status(500).json({ error: e.message });
            
        }
    }

    getById = async (req, res) => {
        const { id } = req.params;
        const requester = getTokenInfo(req.cookies.access_token);
        try {
            const incidence = await this.incidenceModel.getById({ id, requester });
            if (incidence.length === 0) {
                return res.status(404).json({ error: 'Incidence not found' });
            }
            return res.json(incidence);
        } catch (e) {
            return res.status(500).json({ error: e.message });

        }
        
    }

    create = async (req, res) => {
        const incidence = validateIncidence(req.body);
        if (!incidence.success) {
            return res.status(400).json({ error: JSON.parse(incidence.error.message) });
        }
        const issuer = getTokenInfo(req.cookies.access_token);
        const newIncidence = await this.incidenceModel.create({ input: incidence.data, issuer });
        if (!newIncidence.success) {
            return res.status(400).json({ error: newIncidence.message });
        }
        return res.status(201).json(newIncidence);

    }

    update = async (req, res) => {
        const { id } = req.params;
        const issuer = getTokenInfo(req.cookies.access_token);
        const incidence = validatePartialIncidence(req.body);
        if (!incidence.success) {
            return res.status(400).json({ error: JSON.parse(incidence.error.message) });
        }
        const updatedIncidence = await this.incidenceModel.update({ id, input: incidence.data,  issuer});
        if (!updatedIncidence.success) {
            return res.status(400).json({ error: updatedIncidence.message });
        }
        this.notificationController.createFromUpdatingIncidence({input: updatedIncidence});
        res.json(updatedIncidence);
    }

    delete = async (req, res) => {
        const { id } = req.params;
        const requester = getTokenInfo(req.cookies.access_token);
        const deletedResult = await this.incidenceModel.delete({ id, requester });
        if (!deletedResult.success) {
            return res.status(403).json({ error: deletedResult.message });
        }
        res.status(201).json({ message: 'Incidence deleted' });
    }
}