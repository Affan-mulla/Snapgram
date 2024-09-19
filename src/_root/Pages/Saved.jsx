import GridPostList from '@/components/shared/GridPostList'
import Loader from '@/components/shared/Loader'
import { useUserContext } from '@/Context/AuthContext'
import { useSavedPost } from '@/lib/react-query/queriesAndMutation'
import { ID } from 'appwrite'
import React from 'react'

const Saved = () => {
  const {user} = useUserContext();
  const {data : savedPosts, isPending} = useSavedPost({userId : user.id})
  console.log(savedPosts);

  return (
    <div className='saved-container'>
      <h2 className='h3-bold md:h2-bold w-full'>Saved Post</h2>
      <div className='flex flex-wrap gap-9 w-full max-w-5xl'>
        {isPending ? (
          (
            <Loader/>
          )
        ) : (<GridPostList key={ID.unique()} posts={savedPosts} />)}
      </div>
    </div>
  )
}

export default Saved