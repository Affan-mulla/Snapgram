import { useDeleteSavePost, useGetCurrentUser, useLikePost, useSavePost } from '@/lib/react-query/queriesAndMutation'
import { checkIsLiked } from '@/lib/utils';
import React, { useEffect, useState } from 'react'
import Loader from './Loader';

const PostStats = ({ post , userId}) => {
    
    
    const likeslist = post.like.map((user)=> user.$id)

    const [likes, setLikes] = useState(likeslist);
    const [isSaved, setIsSaved] = useState(false);

    const { mutate: likedPost } = useLikePost();
    const { mutate: savePost , isPending: isSaving} = useSavePost();
    const { mutate: deleteSavePost, isPending: isDeleting } = useDeleteSavePost();

    const {data: currentUser} = useGetCurrentUser();

    const handleLikePost = (e) => {

        e.stopPropagation();
        let newLikes = [...likes]

        const hasLiked = newLikes.includes(userId)

        if (hasLiked) {
            newLikes = newLikes.filter((id) => id !== userId);
        }
        else {
            newLikes.push(userId)
        }
        
        setLikes(newLikes);
        likedPost({postId : post?.$id || '', likesArray: newLikes })
        
    }

    const savedPostRecord = currentUser?.save.find((record) => record.post.$id === post?.$id)

    useEffect(()=>{
        setIsSaved(!!savedPostRecord)
    },[currentUser])


    const handleSavePost = (e) => {
        e.stopPropagation();
        
        if (savedPostRecord) {
            setIsSaved(false);
            return deleteSavePost(savedPostRecord.$id);
          }
      
          savePost({ userId: userId, postId: post.$id || ''});
          setIsSaved(true);

        
        
    }

  return (
    <div className='flex justify-between items-center z-20'>
        <div className='flex gap-2 mr-5'>
            <img 
            src={checkIsLiked(likes, userId) 
                ? "/assets/icons/liked.svg" 
                : "/assets/icons/like.svg"}
            alt="like"
            width={20}
            height={20}
            onClick={handleLikePost}
            className='cursor-pointer' />

            <p className='small-medium lg:base-medium'>{likes.length}</p>
        </div>

        <div className='flex gap-2'>
            {isSaving || isDeleting ? <Loader/> : 
            <img 
            src={isSaved
                ? "/assets/icons/saved.svg"
                : "/assets/icons/save.svg"
            }
            alt="like"
            width={20}
            height={20}
            onClick={handleSavePost}
            className='cursor-pointer' />
        }
        </div>
    </div>
  )
}

export default PostStats