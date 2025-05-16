import z from 'zod';

const notificationsSchema = z.object({
    user_id: z.string().uuid({ message: "Invalid UUID format for user_id" }),
    type: z.enum(['Reservation', 'Incidence', 'Message'])
});

export function validateNotification(input){
    return notificationsSchema.safeParse(input);
}

export function validatePartialNotification(input){
    return notificationsSchema.partial().safeParse(input);
}