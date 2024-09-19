import Loader from '@/components/shared/Loader';
import PostCard from '@/components/shared/PostCard';
import { useGetRecentPost } from '@/lib/react-query/queriesAndMutation';
import { ID } from 'appwrite';
import React from 'react'

function Home() {

  const {data : posts, isPending : isPostLoading, isError: isErrorPosts } = useGetRecentPost();

  

  return (
    <div className='flex flex-1'>
      <div className='home-container'>
          <div className='home-posts'>
            <h2 className='h3-bold md:h2-bold text-left w-full'>Home Feed</h2>
            {isPostLoading && !posts ? (
              <Loader/>
            ) : (
              <ul className='flex flex-col flex-1 gap-9 w-full'>
                {posts?.documents.map((post) => (

                  <PostCard post={post} key={ID.unique()} />
                )
                )}
              </ul>
            )}
          </div>
      </div>
    </div>
  )
}

export default Home