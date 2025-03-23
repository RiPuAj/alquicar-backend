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
    try{
        const parsedDate = new Date(date.replace(" ", "T") + "Z");
        return parsedDate.toISOString();
    } catch (e) {
        return date;
    }
};

export const validateReservation = (reservation) => {
    const { start_date, end_date } = reservation;
    const newReservation = {
        ...reservation,
        start_date: redefineTimestampsToDatetime(start_date),
        end_date: redefineTimestampsToDatetime(end_date)
    };

    return reservationSchema.safeParse(newReservation);
}

export const validatePartialReservation = (reservation) => {
    if (!reservation.start_date && !reservation.end_date) return reservationSchema.partial().safeParse(reservation);
    const newReservation = {
        ...reservation
    };

    console.log("AQUI SI ENTRA")
    if (reservation.start_date) {
        newReservation.start_date = redefineTimestampsToDatetime(reservation.start_date);
    } else if (reservation.end_date) {
        newReservation.end_date = redefineTimestampsToDatetime(reservation.end_date);
    }
    
    return reservationSchema.partial().safeParse(newReservation);
}