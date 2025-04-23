import z from 'zod';

const incidenceSchema = z.object({
    
    from_id: z.string().uuid({ message: "Invalid UUID format for from_id" }),
    to_id: z.string().uuid({ message: "Invalid UUID format for to_id" }).nullable().optional(),
    reservation_id: z.number({ message: "Reservation ID must be a number" })
        .int({ message: "Reservation ID must be an integer" })
        .positive({ message: "Reservation ID must be positive" })
        .nullable()
        .optional(),
    description: z.string({ message: "Description is required" })
        .min(1, { message: "Description cannot be empty" }),
    type: z.enum(['USER', 'PLATFORM'], {
        message: "Invalid type. Must be either 'USER' or 'PLATFORM'"
    }),
    status: z.enum(['Pending', 'In Review', 'Resolved', 'Dismissed'], {
        message: "Invalid status. Must be one of: Pending, In Review, Resolved, Dismissed"
    }).default('Pending'),
    created_at: z.date({ message: "Invalid date format for created_at" }).default(new Date())

});


export function validateUser(input){
    return userSchema.safeParse(input);
}

export function validatePartialUser(input){
    return userSchema.partial().safeParse(input);
}