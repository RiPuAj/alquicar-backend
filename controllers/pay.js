import Stripe from 'stripe';

export class PayController {
    
    pay = async (req, res) => {
        const { price, product, quantity } = req.body;
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
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
                    unit_amount: price,  // The price in the smallest currency unit (e.g., cents for EUR)
                    },
                    quantity: quantity,
                    },  
                ],
                mode: 'payment',
                success_url: 'http://localhost:8081/success',
                cancel_url: 'http://localhost:8081/cancel',
            });
            console.log('Session created:', session);

            return res.status(200).json({ url: session.url });

        } catch (err) {
            console.error('Error al crear la sesión de pago:', err);
            return res.status(500).json({ error: 'Error al crear la sesión de pago' });
        }
    }
}