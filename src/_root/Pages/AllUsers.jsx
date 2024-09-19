import GridPostList from '@/components/shared/GridPostList';
import Loader from '@/components/shared/Loader';
import SearchResults from '@/components/shared/SearchResults';
import { Input } from '@/components/ui/input'
import useDebounce from '@/hooks/useDebounce';
import { useAllUsers, useGetCurrentUser, useGetPosts, useSearchPosts, useSearchUsers } from '@/lib/react-query/queriesAndMutation';
import React, { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer';
import User from './User';
import { ID } from 'appwrite';
import { useUserContext } from '@/Context/AuthContext';
import { useParams } from 'react-router-dom';
import SearchedUser from '@/components/shared/SearchedUser';
const AllUsers = () => {

  
  const {ref , inView } = useInView();
  const [searchPeople, setSearchPeople] = useState('');


  const {data : AllUser, isPending } = useAllUsers();
  
  const debouncedValue = useDebounce(searchPeople, 500);

  const {data : People, isFetching : load}  = useSearchUsers(debouncedValue)

  useEffect(()=>{
    if (inView && !searchPeople) {
      fetchNextPage()
    }
  },[inView, searchPeople])

  if (!AllUser) {
    return (
      <div className='flex-center w-full h-full'>
        <Loader />
      </div>
    );
  }
  const shouldShowSearchResult = searchPeople !== '';


  return (
    <div className='explore-container'>
      <div className='explore-inner_container'>
        <h2 className='h3-bold md:h2-bold w-full'>
          Search People
        </h2>

        <div className='flex gap-1 px-4 w-full rounded-lg bg-dark-4'>
          <img src="/assets/icons/search.svg" alt="search"
            width={24}
            height={24} />

          <Input
            type='text'
            className="explore-search"
            placeholder="Search"
            value={searchPeople}
            onChange={(e) => setSearchPeople(e.target.value)} />
        </div>
      </div>

      <div className='flex-between w-full max-w-5xl mt-16 mb-7'>
        <h2 className='body-bold md:h3-bold'>
          Recommended
        </h2>
      </div>

      <div className='flex flex-wrap gap-8 w-full max-w-5xl'>
        {shouldShowSearchResult ? 
        (
          <SearchedUser isSearchFetching={load} searchedUsers={People}  currentId={AllUser[1]} />
        )
        : isPending ? 
        (<Loader/>) :
        (
          AllUser[0].map((user => (
            <User key={ID.unique()} userDetail={user} currentId={AllUser[1]} />
          )))
        )}
      </div>
      
    </div>
  );
}

export default AllUsers