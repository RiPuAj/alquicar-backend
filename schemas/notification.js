import z from 'zod';

const notificationsSchema = z.object({
    user_id: z.string().uuid({ required_error: "A user id must be entered", invalid_type_error: "Invalid UUID format for user_id" }),
    from_id: z.string().uuid({invalid_type_error: "Invalid UUID format for from_id" }).optional(),
    type: z.enum(['Reservation', 'Incidence', 'Message'], 
        {required_error: "A notification type is required", 
        invalid_type_error: "Invalid type. Must be one of: Reservation, Incidence, Message", 
        invalid_enum_value: "Type not found"}),
    content: z.string({ required_error: "Content is required", invalid_type_error: "Content must be a string" }),
    seen: z.boolean({ invalid_type_error: "Seen must be either true or false" }).optional(),
    created_at: z.date({ invalid_type_error: "Invalid date format" }).optional(),
});

export function validateNotification(input){
    return notificationsSchema.safeParse(input);
}

export function validatePartialNotification(input){
    return notificationsSchema.partial().safeParse(input);
}