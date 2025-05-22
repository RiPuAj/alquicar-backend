// routes/payments.js
import { Router } from 'express';
import { PayController } from '../controllers/pay.js';
import Stripe from 'stripe';

export const createPaymentRouter = () => {
  const payRouter = Router();
  const payController = new PayController();
  payRouter.post('', payController.pay );
  payRouter.get('/success/:id/:pc', payController.succes );

  return payRouter;
};
