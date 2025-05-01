import cors from 'cors'
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const ACCEPTED_ORIGINS = ['http://localhost:3001', 'http://localhost:8081']

export const corsMiddlewares = ({acceptedOrigins = ACCEPTED_ORIGINS} = {}) => cors({
    origin: (origin, callback) => {

        if(!origin){
            return callback(null, true)
        }

        if (acceptedOrigins.includes(origin)){
            return callback(null, true)
        }

        return callback(new Error('Not allowed by CORS'))
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,


})