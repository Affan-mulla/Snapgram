import React from 'react'
import Loader from './Loader'
import User from '@/_root/Pages/User'

const SearchedUser = ({isSearchFetching, searchedUsers, currentId}) => {
    if(isSearchFetching) return <Loader/>

    console.log(currentId);
    
    if(searchedUsers && searchedUsers.documents.length > 0) {
      return (
        <User userDetail={searchedUsers.documents[0]} currentId={currentId} />
      )
    }
  
    return (
      <p className='w-full text-center text-light-4 mt-10'>No result found</p>
    )
}

export default SearchedUser