import { z } from "zod"
import React from 'react'
import { Button } from '../../components/ui/button'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form"
import { Input } from "@/components/ui/input"
import { signUpValidation } from "../../lib/validation"
import Loader from "../../components/shared/Loader"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "../../hooks/use-toast"
import { useCreateUserAccount, useSignInAccount } from "../../lib/react-query/queriesAndMutation"
import { useUserContext } from "../../Context/AuthContext"



const SignupForm = () => {
  const { toast } = useToast()
  const {checkAuthUser, isLoading: isUserLoading} = useUserContext();
  const navigate = useNavigate();

  const { mutateAsync, isPending} = useCreateUserAccount();

  const {mutateAsync : signInAccount , isLoading : isSigningIn} = useSignInAccount();

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(signUpValidation),
    defaultValues: {
      name: '',
      username: "",
      email: '',
      password: '',
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values) {
    
    const newUser = await mutateAsync(values)
    
    if (!newUser) {
      return toast({
        
        title: "Uh oh! Something went wrong. Sign Up Failed.",
        
      })
    }
    
    const session = await signInAccount({
      email : values.email,
      password : values.password
    });

    if (!session) {
      return toast({ title : 'sign in failed. please try again.'})
    }

    const isLoggedIn = await checkAuthUser();

    if(isLoggedIn) {
      form.reset();


      navigate('/')
    } else {
      return toast({ title : 'sign in failed. please try again.'})
    }
    

  }

  return (
    <Form {...form}>

      <div className=" sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-7">Create a new account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">To use Snapgram enter the details.</p>


        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 mt-4 w-full">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type= 'text' placeholder="Name" {...field} className='shad-input' />
                </FormControl>
                
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Name</FormLabel>
                <FormControl>
                  <Input type= 'text' placeholder="UserName" {...field} className='shad-input' />
                </FormControl>
                
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type= 'email' placeholder="Email" {...field} className='shad-input' />
                </FormControl>
                
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type= 'password' placeholder="Password" {...field} className='shad-input' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {isPending ? (
              <div className="flex-center gap-2">
                <Loader />
              </div>
            ) : "Sign Up"}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an Account ? 
            <Link to={'/sign-in'} className="text-small-semibold text-primary-500  ml-1 ">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignupForm