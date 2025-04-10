import { Router } from 'express';
import { AuthController } from '../controller/auth.controller.js';

export const authRouter = Router();

authRouter.post('/register', AuthController.register);
authRouter.post('/login', AuthController.login);
