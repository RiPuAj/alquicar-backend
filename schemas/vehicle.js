import z from 'zod';

const vehicleSchema = z.object({

});


export function validateVehicle(input){
    return vehicleSchema.safeParse(input);
}

export function validatePartialVehicle(input){
    return vehicleSchema.partial().safeParse(input);
}