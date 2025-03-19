import express from 'express'
import { UserModel } from './models/mysql/user.js';

const PORT = process.env.PORT ?? 3000;

const app = express();
app.use(express.json());
app.disable('x-powered-by');


app.use((req, res) => {
    res.status(404).send('<h1>404 Not Found</h1>');
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    }
);