import z from 'zod' 

export const signUpValidation = z.object({
    name : z.string().min(2,{message: 'too short'}),
    username: z.string().min(2).max(15),
    email : z.string().email(),
    password : z.string().min(8, {message: 'Password must be characters'}),
  })
  
export const signinValidation = z.object({
    email : z.string().email(),
    password : z.string().min(8, {message: 'Password must be characters'}),
  })

export const PostValidation = z.object({
   caption : z.string().min(5).max(2200),
   file : z.custom(),
   location: z.string().min(2).max(100),
   tags : z.string(),

  })
  
export const UpdateProfileValidation = z.object({
  file: z.custom(),
  name : z.string().min(2,{message: 'too short'}),
  username: z.string().min(2).max(15),
  email : z.string().email(),
  bio: z.string().max(100)
})