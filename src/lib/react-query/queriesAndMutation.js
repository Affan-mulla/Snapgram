import {
  useQuery,
  useMutation,
  useInfiniteQuery, 
  useQueryClient,
} from "@tanstack/react-query";

import authService from "../appWrite/config";
import { QUERY_KEYS } from "./queryKeys";


export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: ({name, email, username,password}) => authService.createAccount({name, email, username,password}),
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: ({ email,password}) => authService.SignInAccount({ email,password}),
  });
};
export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: () => authService.signOutAccount()
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({userId, caption, file, location, tags}) => authService.createPost({userId, caption, file, location, tags}),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
    })
    }
  })
}

export const useGetRecentPost = () => {
  return useQuery({
    queryKey : [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: () => authService.getRecentPost()
  })
}

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, likesArray }) => authService.likePost({postId,likesArray}),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]
      })
    }
  })
}
export const useSavePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, userId }) => authService.savePost({postId,userId}),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]
      })
    }
  })
}

export const useDeleteSavePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (savedRecordId) => authService.deleteSavePost(savedRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]
      })
    }
  })
}

export const useGetCurrentUser =() => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: (() => authService.getCurrentUser())
  })
}

export const useGetPostById = (postId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: ()=> authService.getPostById(postId),
    enabled: !!postId,
  })
}

export const useUpdatePost = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({postId, caption, file, location, tags, imageId, imageUrl})=> authService.updatePost({postId, caption, file, location, tags, imageId, imageUrl}),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
      })
    }
  })
}

export const useDeletePost = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({postId,imageId})=> authService.deletePost({postId, imageId}),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
    }
  })
}

// Hook using react-query
export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: ({ pageParam }) => authService.getInfinitePost({ pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage && lastPage.documents.length === 0) {
        return null;
      }
      const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
      return lastId;
    },
  });
};

export const useSearchPosts = (searchTerm) => {

  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => authService.searchPost(searchTerm),
    enabled: !!searchTerm
  })
}

export const useGetUserById = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, id],
    queryFn: ()=> authService.getUserById(id)
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({name,username,email,bio,imageUrl,userId,file})=> authService.updateUserProfile({name,username,file,email,bio,imageUrl,userId}),
    onSuccess: (data) => {
      
      
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id]
      })
    }
  })
   
}
export const useSavedPost = (userId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POSTS],
    queryFn: () => authService.savedPost(userId),
  })
} 

export const useAllUsers = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: ()=> authService.allUsers(),
  })
}

export const useFollowing = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({followId , followerId}) => authService.toggleFollow({followId, followerId }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.id]
      })
    }
  })
}

export const useSearchUsers = (username) => {

  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS, username],
    queryFn: () => authService.searchUsers(username),
    enabled: !!username
  })
}