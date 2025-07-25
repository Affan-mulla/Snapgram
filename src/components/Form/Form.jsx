import React, { useEffect } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage,
} from "./../ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from '../ui/textarea'
import FileUploader from '../shared/FileUploader'
import { PostValidation } from '@/lib/validation'
import { useUserContext } from '@/Context/AuthContext'
import { toast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import { useCreatePost, useUpdatePost } from '@/lib/react-query/queriesAndMutation'




const PostForm = ({ post , action}) => {



    const {user} = useUserContext();
    const navigate = useNavigate();
    
    
    const {mutateAsync : CreatePost, isPending : isLoadingCreate} = useCreatePost();

    const {mutateAsync : UpdatePost, isPending : isLoadingUpdate} = useUpdatePost();

    // 1. Define your form.
    const form = useForm({
        resolver: zodResolver(PostValidation),
        defaultValues: {
            caption: post? post?.caption : "",
            file : [],
            location: post ? post?.location : "",
            tags : post ? post?.tags.join(',') : '',
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values) {
        if (post && action === 'Update') {
            const updatedPost = await UpdatePost({
                ...values,
                postId: post.$id,
                imageId : post.imageId,
                imageUrl : post.imageUrl,
            })

            
            

            if (!updatedPost) {
                toast({
                    title: 'Please try again.'
                })
            }

            return navigate(`/posts/${post.$id}`)
        }

        const newPost = await CreatePost({
            userId : user.id,  
            ...values
        })
        console.log(newPost);

        if (!newPost) {
            toast({
                title: 'Please try again.'
            })
        }

        navigate('/')
    }

    

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
                <FormField
                    control={form.control}
                    name="caption"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='shad-form_label'>Caption</FormLabel>
                            <FormControl>
                                <Textarea placeholder="shadcn" {...field} className='shad-textarea custom-scrollbar' />
                            </FormControl>
                            <FormMessage className='shad-form_message' />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='shad-form_label'>Add Photo</FormLabel>
                            <FormControl>
                                <FileUploader 
                                fieldChange = {field.onChange}
                                mediaUrl = {post?.imageUrl}
                                />
                            </FormControl>
                            <FormMessage className='shad-form_message' />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='shad-form_label'>Add Location</FormLabel>
                            <FormControl>
                                <Input type='text' className='shad-input'
                                {...field}
                                >
                                </Input>              
                            </FormControl>
                            <FormMessage className='shad-form_message' />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='shad-form_label'>Add Tags (separated by comma " , ")</FormLabel>
                            <FormControl>
                                <Input 
                                type='text' className='shad-input'
                                placeholder="Art, Expression, Learn"
                                {...field}
                                >
                                </Input>              
                            </FormControl>
                            <FormMessage className='shad-form_message' />
                        </FormItem>
                    )}
                />
                <div className='flex gap-4 items-center justify-end'>
                <Button 
                type="button"
                className='shad-button_dark_4'
                >
                    Cancel
                </Button>

                <Button 
                type="submit"
                className='shad-button_primary whitespace-nowrap'
                disabled={isLoadingCreate || isLoadingUpdate}
                >
                    {isLoadingCreate || isLoadingUpdate && 'Loading...'}
                    {action} Post
                </Button>
                </div>
            </form>
        </Form>
    )
}

export default PostForm