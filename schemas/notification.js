import z from 'zod';

const notificationsSchema = z.object({
    user_id: z.string().uuid({ message: "Invalid UUID format for user_id" }),
    type: z.enum(['Reservation', 'Incidence', 'Message']),
    content: z.string({ required_error: "Content is required", invalid_type_error: "Content must be a string" }),
    seen: z.boolean({ message: "Seen must be either true or false" }).optional(),
    created_at: z.date({ message: "Invalid date format" }).optional(),
});

export function validateNotification(input){
    return notificationsSchema.safeParse(input);
}

export function validatePartialNotification(input){
    return notificationsSchema.partial().safeParse(input);
}