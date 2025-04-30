import jwt from 'jsonwebtoken';

export const getTokenInfo = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}