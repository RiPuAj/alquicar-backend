import express from 'express'
import { corsMiddlewares } from './Middlewares/cors.js';

const PORT = process.env.PORT ?? 3000;

const app = express();
app.use(express.json());
app.use(corsMiddlewares());
app.disable('x-powered-by');

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    }
);