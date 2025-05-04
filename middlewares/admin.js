import jwt from 'jsonwebtoken';
import { getTokenInfo } from '../utils/tokens.js';



export const adminMiddleware = (req, res, next) => {
    const token = req.cookies.access_token;

    try {
        const tokenInfo = getTokenInfo(token);
        if (tokenInfo.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado: no eres administrador' });
        }
        req.user = tokenInfo; // Adjunta la información del usuario al objeto req
        next();
    } catch (e) {
        res.status(400).json({ message: 'Token inválido' });
    }
};


export const adminOrSelfMiddleware = (req, res, next) => {
    const token = req.cookies.access_token; 
    try {
        const tokenInfo = getTokenInfo(token);
        
        if (tokenInfo.role === 'admin') {
            req.user = tokenInfo; 
            return next();
        }

        if (tokenInfo.id === req.params.id) {
            req.user = tokenInfo; 
            return next();
        }

        return res.status(403).json({ message: 'Acceso denegado: no tienes los permisos para realizar esta acción' });
    } catch (e) {
        res.status(400).json({ message: 'Token inválido' });
    }
};


