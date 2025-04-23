import z from 'zod';

const vehicleSchema = z.object({
    owner_id: z.string().uuid({ message: "Invalid UUID format for owner_id" }),
    brand: z.enum(['Toyota', 'Ford', 'BMW', 'Honda', 'Chevrolet', 'Mercedes-Benz', 'Audi', 'Nissan', 'Volkswagen', 
    'Hyundai', 'Kia', 'Peugeot', 'Mazda', 'Subaru', 'Renault', 'Fiat', 'Porsche', 'Lexus', 'Chrysler', 
    'Dodge', 'Jeep', 'Tesla', 'Land Rover', 'Jaguar', 'Ferrari', 'Lamborghini', 'Aston Martin', 'Maserati', 
    'Bentley', 'Rolls-Royce', 'McLaren'], { 
        invalid_type_error: "Not a brand model",
        invalid_enum_value: "Brand not found"
    }),
    model: z.string(),
    latitude: z
    .number({ required_error: "Latitude is required", invalid_type_error: "Latitude must be a number" })
    .min(-90, { message: "Latitude must be ≥ -90" })
    .max(90, { message: "Latitude must be ≤ 90" })
    .refine((val) => Number.isInteger(val * 1_000_000), {
      message: "Latitude must have at most 6 decimal places",
    }),
    longitude: z
    .number({ required_error: "Longitude is required", invalid_type_error: "Longitude must be a number" })
    .min(-180, { message: "Longitude must be ≥ -180" })
    .max(180, { message: "Longitude must be ≤ 180" })
    .refine((val) => Number.isInteger(val * 1_000_000), {
      message: "Longitude must have at most 6 decimal places",
    }),
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