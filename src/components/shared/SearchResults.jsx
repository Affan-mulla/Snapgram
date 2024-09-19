import React from 'react'
import Loader from './Loader'
import GridPostList from './GridPostList'

const SearchResults = ({isSearchFetching, searchedPosts}) => {
  console.log(searchedPosts);
  
  if(isSearchFetching) return <Loader/>

  
  if(searchedPosts && searchedPosts.documents.length > 0) {
    return (
      <GridPostList posts={searchedPosts.documents}/>
    )
  }

  return (
    <p className='w-full text-center text-light-4 mt-10'>No result found</p>
  )
}

export default SearchResults