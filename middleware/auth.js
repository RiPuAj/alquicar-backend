import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
  const token = req.cookies.access_token
  
  if (!token) return res.status(401).json({ message: 'Falta token' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (e) {
    res.status(400).json({ message: 'Token inválido' });
  }
}
