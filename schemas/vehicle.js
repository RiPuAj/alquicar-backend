import z from 'zod';

const vehicleSchema = z.object({
    owner_id: z.string().uuid({ message: "Invalid UUID format for owner_id" }),
    brand_id: z.number().int({ message : "Brand id must be an integer"}),
    model_id: z.number().int({message : "Model id must be an integer"}),
    year: z.number()
    .int({message : "Not a year"})
    .min(1900, {message : "Year must be at least 1900"})
    .max(2025, { message: "Year cannot be greater than 2025" }),
    type: z.enum(['Sedan', 'SUV', 'Truck', 'Sports', 'Hatchback', 'Convertible']),
    transmission: z.enum(['Manual', 'Automatic'], {
        message: "Invalid transmission type. Must be either 'Manual' or 'Automatic'"
    }),
    fuel_type: z.enum(['Gasoline', 'Diesel', 'Electric', 'Hybrid'], {
        message: "Invalid fuel type. Must be one of: Gasoline, Diesel, Electric, Hybrid"
    }),
    capacity: z.number().int().min(1, { message: "Capacity must be at least 1" }),
    num_doors: z.number().int().min(2, { message: "Number of doors must be at least 2" }),
    daily_price: z.number({message : "Not a valid price"})
    .positive({ message: "Daily price must be a positive number" }),
    deposit: z.number({message : "Not a valid deposit"})
    .positive({ message: "Deposit must be a positive number" }).optional(),
    availability: z.boolean({ message: "Availability must be either true or false" }).optional(),
    registration_date: z.date({ message: "Invalid date format" }).optional()

});


export function validateVehicle(input){
    return vehicleSchema.safeParse(input);
}

export function validatePartialVehicle(input){
    return vehicleSchema.partial().safeParse(input);
}