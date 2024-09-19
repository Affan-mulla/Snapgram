import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUserContext } from '@/Context/AuthContext';
import { UpdateProfileValidation } from '@/lib/validation'; // Your Zod validation schema
import { useDropzone } from 'react-dropzone';
import { useUpdateProfile } from '@/lib/react-query/queriesAndMutation'; // Assuming you have this query hook
import { useNavigate } from 'react-router-dom';

const UpdateProfile = () => {
  const { user } = useUserContext();
  const [fileUrl, setFileUrl] = useState(user?.imageUrl || '');
  const navigate = useNavigate();


  // Hook to handle form submission
  const { mutateAsync: updateProfile, isLoading } = useUpdateProfile(); // Mutation hook for updating profile

  const form = useForm({
    resolver: zodResolver(UpdateProfileValidation),
    defaultValues: {
      file: [],
      name: user.name,
      username: user.username,
      email: user?.email,
      bio: user?.bio || '',
    },
  });

  const onDrop = useCallback((acceptedFiles) => {
    setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    form.setValue('file', acceptedFiles); // Setting file in form state
  }, [form]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
  });

  async function onSubmit(data) {

    const updatedProfile = await updateProfile({
      ...data,
      userId: user.id,
      imageUrl: user.imageUrl,
    })
    

    if (!updatedProfile) {
      toast({
        title: 'Please try again.'
      })
    }

    return navigate(`/profile/${updatedProfile.$id}`)

  }

  const backToProfile = () => navigate('/')

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start max-w-5xl w-full">
          <img
            src="/assets/icons/edit.svg"
            alt="edit"
            width={36}
            height={36}
          />
          <h2 className="h3-bold md:h2-bold w-full text-left">Update Profile</h2>
        </div>

        <Form {...form}>
          <div className="sm:w-420 flex-center flex-col w-full">
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 mt-4 w-full">

              {/* File Upload Field */}
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem className="flex w-full items-center gap-6">
                    <img src={fileUrl || user.imageUrl} alt="profile-img" className="object-cover w-14 h-14 rounded-full" />
                    <FormControl>
                      <div {...getRootProps()}>
                        <label className="cursor-pointer text-blue-400 hover:text-blue-500 transition duration-200">
                          Choose Profile Picture
                        </label>
                        <input
                          id="profile-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          {...getInputProps()}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Name" {...field} className="shad-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Username Field */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Username" {...field} className="shad-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" {...field} className="shad-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bio Field */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell us about yourself" {...field} className="shad-textarea custom-scrollbar" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="flex gap-4 items-center justify-end">
                <Button type="button" className="shad-button_dark_4" onClick={backToProfile}>
                  Cancel
                </Button>
                <Button type="submit" className="shad-button_primary whitespace-nowrap" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update'}
                </Button>
              </div>
            </form>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default UpdateProfile;
