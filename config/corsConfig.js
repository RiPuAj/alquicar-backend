import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

export const corsConfig = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
};