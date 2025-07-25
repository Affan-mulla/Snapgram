import BottomBar from '@/components/shared/BottomBar'
import LeftSidebar from './../components/shared/LeftSidebar'
import Topbar from '@/components/shared/Topbar'
import React from 'react'
import { Outlet } from 'react-router-dom'

function RootLayout() {
  return (
    <div className='w-full md:flex'>
      <Topbar/>
      <LeftSidebar/>
      
      <section className='flex flex-1 h-full'>
        <Outlet />
      </section>

      <BottomBar />
    </div>
  )
}

export default RootLayout