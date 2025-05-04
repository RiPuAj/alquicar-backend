import { z } from 'zod';

export const messageSchema = z.object({
    from_id: z.string().uuid(),
    to_id: z.string().uuid(),
    content: z.string({
        invalid_type_error: 'Message must be a string',
        invalid_length_error: 'Message must be between 1 and 255 characters',
    }).min(1),
    status: z.enum(['sent', 'received', 'read']).optional(),
    created_at: z.string().datetime({
        message: 'Created at must be a valid date',
    }).optional(),
})

export const validateMessage = (reservation) => {
    return messageSchema.safeParse(reservation);
}

export const validatePartialMessage = (reservation) => {
    return messageSchema.partial().safeParse(reservation);
}