import z from 'zod';

const reservationSchema = z.object({

    //TODO IDS DE VEHICULO Y CLIENTE
    start_date: z.string().datetime(),
    end_date: z.string().datetime(),
    total_price: z.number().min(0),
    status: z.enum(['Pending', 'Confirmed', 'Cancelled', 'Completed']),
    created_at: z.string().datetime().optional()
})

export function validateReservation(input){
    return reservationSchema.safeParse(input);
}

export function validatePartialReservation(input){
    return reservationSchema.partial().safeParse(input);
}