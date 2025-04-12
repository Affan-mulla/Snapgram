import { Button } from '@/components/ui/button'
import React from 'react'
import { Link } from 'react-router-dom'

const User = ({userDetail, currentId}) => {
  return (
    <Link to={`/profile/${userDetail.$id}`}>
        <div className='w-40 h-50  flex-center flex-col gap-1 p-5 rounded-lg border-2 border-dark-4'>
            <img src={userDetail.imageUrl || "/public/assets/icons/profile-placeholder.svg"} alt="profile" className=' rounded-full w-12 h-12 object-cover'/>
            <h2 className='body-medium'>{userDetail.name}</h2>
            <p className='text-light-4 small-medium'>@{userDetail.username}</p>
            <Button className='shad-button_primary'>{userDetail.follower.includes(currentId) ? "Unfollow" : "Follow"}</Button>
        </div>
    </Link>
  )
}

export default User