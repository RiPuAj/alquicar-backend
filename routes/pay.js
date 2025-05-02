// routes/payments.js
import { Router } from 'express';
import Stripe from 'stripe';

export const createPaymentRouter = () => {
  const payRouter = Router();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Usá una variable de entorno para la clave

  payRouter.post('/pay', async (req, res) => {
    const { product, quantity } = req.body;

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: product.name,
              },
              unit_amount: product.price * 100, // en centavos
            },
            quantity: quantity,
          },
        ],
        mode: 'payment',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
      });

      res.json({ id: session.id });
    } catch (err) {
      console.error('Error al crear la sesión de pago:', err);
      res.status(500).json({ error: 'Error al crear la sesión de pago' });
    }
  });

  return payRouter;
};
