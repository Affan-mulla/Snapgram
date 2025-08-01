import { useUserContext } from '@/Context/AuthContext';
import { timeAgo } from '@/lib/utils';
import React from 'react'
import { Link } from 'react-router-dom';
import PostStats from './PostStats';
const PostCard = ({ post }) => {
  
  const {user} = useUserContext();

  if (!post.creator) return ;
  

  return (
    <div className='post-card'>
      <div className='flex-between'>
        <div className='flex items-center gap-3'>
          <Link to={`/profile/${post.creator.$id}`}>
            <img src={post?.creator?.imageUrl || '/assets/icons/profile-placeholder.svg'} alt=""
              className=' rounded-full w-12 h-12 object-cover' />
          </Link>

          <div className='flex flex-col'>
            <p className='base-medium lg-body-bold text-light-1'>
              {post.creator.name}
            </p>
            <div className='flex-center gap-2 text-light-3'>
              <p className='subtle-semibold lg:small:regular'>
                {timeAgo(post.$createdAt)}
              </p>
              <p className='subtle-semibold lg:small:regular'>
                {post.location}
              </p>
            </div>
          </div>
        </div>
        <Link to={`/update-post/${post.$id}`}
        className={`${user.id !== post.creator.$id && "hidden"}`}>

          <img src="/assets/icons/edit.svg" alt="edit"
          width={20}
          height={20} />
        </Link>
      </div>
      <Link to={`/posts/${post.$id}`}>
        <div className='small-medium lg:base-medium py-5'>
          <p className=''>
              {post.caption}
          </p>
          <ul className='flex gap-1 mt-2'>
            {post.tags.map((tag)=> (
              <li key={tag} className='text-light-3'>
                  #{tag}
              </li>
            ))}
          </ul>
        </div>

        <img src={post.imageUrl || '/assets/icons/profile-placeholder.svg'}
        className='post-card_img' 
        alt="post-image"/> 
      </Link>

      <PostStats post={post} userId = {user.id} />
    </div>
  )
}

export default PostCard