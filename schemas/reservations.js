import z, { string } from 'zod';

export const reservationSchema = z.object({
    vehicle_id: z.number().positive(),
    customer_id: z.string().uuid(),
    start_date: z.string().datetime(),
    end_date: z.string().datetime(),
    total_price: z.number().positive(),
    status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional(),
});

// Datetime de ZOD no admite timestamp, por lo que se redefine la función para que acepte timestamps
const redefineTimestampsToDatetime = (date) => {
    if (!(typeof date === "string")) return date;
    try {
        const parsedDate = new Date(date.replace(" ", "T") + "Z");
        return parsedDate.toISOString();
    } catch (e) {
        return date;
    }
};

export const validateReservation = (reservation) => {
    return reservationSchema.safeParse(reservation);
}

export const validatePartialReservation = (reservation) => {
    return reservationSchema.partial().safeParse(reservation);
}