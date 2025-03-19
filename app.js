import express from 'express';
import dotenv from 'dotenv';
import { userRouter } from './routes/users.js';


dotenv.config({path: './.env'});

const app = express();
app.use(express.json());
app.disable('x-powered-by');

app.use('/users', userRouter);


app.use((req, res) => {
    res.status(404).send('<h1>404 Not Found</h1>');
})

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
    }
);