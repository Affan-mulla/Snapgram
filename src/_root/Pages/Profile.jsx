import Loader from '@/components/shared/Loader';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/Context/AuthContext'
import { useFollowing, useGetUserById, } from '@/lib/react-query/queriesAndMutation';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GridPostList from '@/components/shared/GridPostList';
import { ID } from 'appwrite';
const Profile = () => {
  const { id } = useParams();
  const { user } = useUserContext();

  const { data: posts, isPending: loading, refetch } = useGetUserById(id);
  const { mutateAsync: following, isPending: followPending } = useFollowing();

  const [follows, setFollows] = useState([])

  if (loading) return (<Loader />)


  const userGrid = [...posts.posts].reverse()

  const userLiked = [...posts.liked].reverse()

  const FollowHandler = async (e) => {
    e.stopPropagation();
    setFollows(posts.follower)
    let newFollow = [...follows];
    const hasFollow = newFollow.includes(id);

    if (hasFollow) {
      newFollow = newFollow.filter((followId) => followId !== id);
    } else {
      newFollow.push(id);
    }

    try {
      const da = await following({ followId: user.id, followerId: id });
      setFollows(newFollow);
      refetch()
    } catch (err) {
      console.error("Error following/unfollowing:", err);
    }
  };


  return (
    <div className='profile-container '>
      <div className='profile-inner_container'>
        <div className='flex w-full gap-8 px-2 md:px-4'>
          <img src={posts.imageUrl} alt="profile-img" className='md:w-20 md:h-20 h-[100px] w-[100px] rounded-full object-cover' />

          <div className='flex w-full flex-col flex-center gap-4'>
            <div className='flex lg:gap-20 md:gap-14 gap-6 w-full flex-wrap'>
              <div>

                <h2 className='lg:h1-bold h2-bold'>{posts.name}</h2>
                <p className='small-regular text-light-3'>@{posts.username}</p>
              </div>

              {user.id === id ? (
                <Link to={`/update-profile/${id}`} className="shad-button_dark_4 flex-center rounded-lg">
                  <img src="/assets/icons/edit.svg" alt="" height={16} width={16} />
                  <p>Edit Profile</p>
                </Link>
              ) : (
                <Button className='shad-button_primary' onClick={(e) => {
                  FollowHandler(e)
                }}> {followPending ? <Loader/> : posts.follower.includes(user.id) ? 'Unfollow' : 'Follow'} </Button>
              )}
            </div>

            <div className='w-full flex gap-4 base-semibold text-light-2'>
              <p><span className='text-primary-500 mx-2 text-xl text-center'>{posts.follower.length}</span>  Followers</p>
              <p><span className='text-primary-500 mx-2 text-xl text-center'>{posts.following.length}</span> Following</p>
              <p><span className='text-primary-500 mx-2 text-xl text-center'>{posts.posts.length}</span> Post</p>
            </div>

            <div className='base-regular text-start w-full'>
              {posts.bio}
            </div>
          </div>
        </div>

      </div>
      <div className='profile-inner_container'>
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="bg-dark-3 mb-2">

            <TabsTrigger className=" focus-within:border-2 transition-all duration-0 focus-within:border-zinc-800" value="account">Posts</TabsTrigger>

            <TabsTrigger value="password" className={` focus-within:border-2 transition-all duration-0 focus-within:border-zinc-800 ${id !== user.id && "hidden"}`} >Liked Posts</TabsTrigger>

          </TabsList>

          <TabsContent value="account"><GridPostList key={ID.unique} posts={userGrid} showUser={false} showStats={false} /></TabsContent>

          <TabsContent value="password" className={`${id !== user.id && "hidden"}`}><GridPostList key={ID.unique()} posts={userLiked} showStats={false} showUser={false} /></TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Profile