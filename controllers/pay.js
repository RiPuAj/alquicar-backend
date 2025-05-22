import Stripe from 'stripe';
import { ReservationModel } from '../models/mysql/reservations.js';
import { VehicleModel } from '../models/mysql/vehicle.js';
import { UserModel } from '../models/mysql/users.js'; 
export class PayController {
    
    pay = async (req, res) => {
        const { reservationid } = req.body;
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        try {
        const reservation = await ReservationModel.getById({ id: reservationid });
        const vehicle = await VehicleModel.getById({ id: reservation[0].vehicle_id });
        const owner = await UserModel.getById({ id: vehicle[0].owner_id });
        const ownername = vehicle[0].brand + ' ' + vehicle[0].model + ' of ' + owner[0].name;
        
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                    price_data: {
                    currency: 'eur',
                    product_data: {
                        name: ownername,
                    },
                    unit_amount: (reservation[0].total_price*100),  // The price in the smallest currency unit (e.g., cents for EUR)
                    },
                    quantity: 1,
                    },  
                ],
                mode: 'payment',
                success_url: 'http://localhost:8081/success',
                cancel_url: 'http://localhost:8081/cancel',
            });
            //console.log('Session created:', session);

            return res.status(200).json({ url: session.url });

        } catch (err) {
            console.error('Error al crear la sesión de pago:', err);
            return res.status(500).json({ error: 'Error al crear la sesión de pago' });
        }
    }
}