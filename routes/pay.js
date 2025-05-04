// routes/payments.js
import { Router } from 'express';
import Stripe from 'stripe';

export const createPaymentRouter = () => {
  const payRouter = Router();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  console.log('Stripe initialized with ', stripe);
  console.log('Stripe initialized with secre');
  payRouter.post('/pay', async (req, res) => {
    const { product, quantity } = req.body;

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: '1',
            quantity: quantity,
          },
        ],
        mode: 'payment',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
      });
      console.log('Session created:', session);

      rres.redirect(303, session.url);
    } catch (err) {
      console.error('Error al crear la sesión de pago:', err);
      res.status(500).json({ error: 'Error al crear la sesión de pago' });
    }
  });

  return payRouter;
};
