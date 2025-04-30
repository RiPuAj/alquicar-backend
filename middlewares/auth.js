import jwt from 'jsonwebtoken';
import { getTokenInfo } from '../utils/tokens.js';
import { disconnectSocket } from '../utils/sockets.js';

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.access_token
  if (!token) return res.status(401).json({ message: 'Falta token' });

  try {
    const verified = getTokenInfo(token);
    req.user = verified;
    next();
  } catch (e) {
    res.status(400).json({ message: 'Token inválido' });
  }
}


export const authMiddlewareSocket = (socket, next) => {

  try{
    const cookies = socket.handshake.headers.cookie;

  if (!cookies) return disconnectSocket(socket, 'Falta cookies');

  const token = cookies.split('; ').find(row => row.startsWith('access_token=')).split('=')[1];

  if (!token) return disconnectSocket(socket, 'Falta token');
  } catch (e) {
    
    return disconnectSocket(socket, 'Falta token');
  }

  next();
}
