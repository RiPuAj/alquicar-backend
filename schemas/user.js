import z from 'zod';


const dniRegex = /^[0-9]{8}[A-Za-z]$/;
const phoneRegex = /^[0-9]{9}$/;

const userSchema = z.object({
    
    name: z.string({
        invalid_type_error: 'Name must be a string',
        invalid_length_error: 'Name must be between 3 and 255 characters',
    }).min(3).max(255),

    email: z.string({
        invalid_type_error: 'Email must be a string',
        invalid_email_error: 'Email must be a valid email',
        invalid_length_error: 'Email must be between 3 and 255 characters',
    }).email().max(255),

    password: z.string({
        invalid_type_error: 'Password must be a string',
        invalid_length_error: 'Password must be between 8 and 255 characters',
    }).min(8).max(255),

    address: z.string({
        invalid_type_error: 'Address must be a string',
        invalid_length_error: 'Address must be between 3 and 255 characters',
    }).max(255),

    phone: z.string({
        invalid_type_error: 'Phone must be a string',
        invalid_phone_error: 'Phone must be a valid phone number',
    }).regex(phoneRegex),
    
    role: z.enum(['admin', 'user']),
    dni: z.string().regex(dniRegex),
});


export function validateUser(input){
    return userSchema.safeParse(input);
}

export function validatePartialUser(input){
    return userSchema.partial().safeParse(input);
}