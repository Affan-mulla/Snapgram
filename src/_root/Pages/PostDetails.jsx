import Loader from '@/components/shared/Loader';
import PostStats from '@/components/shared/PostStats';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/Context/AuthContext';
import { useDeletePost, useGetPostById } from '@/lib/react-query/queriesAndMutation'
import { timeAgo } from '@/lib/utils';
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
const PostDetails = () => {

  const navigate =  useNavigate();
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || '');
  const {mutateAsync : delPost} = useDeletePost();
  const {user} = useUserContext();
  

  async function handleDeletePost() {
    try {
      const deleted = await delPost({
        postId: post.$id,
        imageId: post.imageId
      });
    
      if (!deleted) {
        throw new Error("Failed to delete post");
      }
    
      navigate('/');
    } catch (error) {
      console.error(error);
      // Optionally, you can show an error message to the user
    }
    
  }

  return (
    <div className='post_details-container'>
      {isPending ? <Loader /> : (
        <div className='post_details-card'>

          <img src={post?.imageUrl} alt="post" className='post_details-img' />

          <div className='post_details-info'>

            <div className='flex-between w-full'>
              <Link to={`/profile/${post.creator.$id}`} className='flex items-center gap-3'>
               
                <img src={post?.creator?.imageUrl || '/assets/icons/profile-placeholder.svg'} alt=""
                  className=' rounded-full w-8 h-8 lg:w-12 lg:h-12' />


                <div className='flex flex-col'>
                  <p className='base-medium lg-body-bold text-light-1'>
                    {post?.creator.name}
                  </p>

                  <div className='flex-center gap-2 text-light-3'>

                    <p className='subtle-semibold lg:small:regular'>
                      {timeAgo(post?.$createdAt)}
                    </p>

                    <p className='subtle-semibold lg:small:regular'>
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className='flex-center gap-1'>
                  <Link to={`/update-post/${post?.$id}`} className={`${user.id !== post.creator.$id && 'hidden'}`}>
                    
                    <img src="/assets/icons/edit.svg" alt="edit"
                    width={24}
                    height={24} />
                  </Link>

                  <Button
                   onClick={handleDeletePost}
                   variant="ghost"
                   className={`ghost_details-delete_btn ${user.id !== post?.creator.$id && 'hidden'}`}
                  >
                    <img src="/assets/icons/delete.svg" alt="delete"
                    width={24}
                    height={24} />
                  </Button>
              </div>

            </div>

            <hr className='border w-full border-dark-4/80'/>

            <div className='small-medium lg:base-medium flex flex-col flex-1'>
          <p className=''>
              {post?.caption}
          </p>
          <ul className='flex gap-1 mt-2'>
            {post?.tags.map((tag)=> (
              <li key={tag} className='text-light-3'>
                  #{tag}
              </li>
            ))}
          </ul>
        </div>

        <div className='w-full'>
            <PostStats post={post} userId={user.id}/>
        </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostDetails