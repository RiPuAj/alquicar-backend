import { Router } from 'express';
import { AuthController } from '../controllers/auth.js';

/*
export const authRouter = Router();

authRouter.post('/register', AuthController.register);
authRouter.post('/login', AuthController.login);*/


export const createAuthRouter = ({ userModel }) => {

    const authRouter = Router();
    const authController = new AuthController({ userModel });


    authRouter.post('/register', authController.register);
    authRouter.post('/login', authController.login);
    authRouter.get('/verify', authController.verifyAccount);

    return authRouter;
}
