import z from 'zod'


export const UserSignUpZodSchema=z.object({
    email:
        z.string({message:"Email must be provided"})
        .min(3,{message:"Email must be minimum of 3 characters"})
        .max(30,{message:"Email cannot exceed 30 characters"})
        .email({message:"Enter Valid Email"}),
    password:
        z.string({message:"Password must be provided"})
        .min(6,{message:"Password must be atleast 6 characters"}),
    phoneNumber:
        z.number({message:"PhoneNumber must be provided"})
        .min(1000000000,{message:"Enter valid Phone Number"})
        .max(9999999999,{message:"Enter valid Phone Number"}),
    fullname:
        z.string({message:"FullName must be provided"})
        .min(3,{message:"Enter full name"})

})

export const UserSignInZodSchema=z.object({
    email:
        z.string({message:"Email must be provided"})
        .email({message:"Enter Valid Email"}),
    password:
        z.string({message:"Password must be provided"})
        
    
})
export const UserUpdateZodSchema=z.object({
    password:
        z.string().optional(),
        
    fullname:
        z.string().optional()
        
    
})