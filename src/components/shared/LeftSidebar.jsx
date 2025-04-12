import React, { useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutation'
import { useUserContext } from '@/Context/AuthContext'
import { sidebarLinks } from '@/constants'
import { useLocation } from 'react-router-dom'

const LeftSidebar = () => {
    const {pathname} = useLocation()
    const { mutate: signOut, isSuccess } = useSignOutAccount();
    const navigate = useNavigate();
    const { user } = useUserContext();


    useEffect(() => {
        if (isSuccess) navigate(0)
    }, [isSuccess])
    return (
        <nav className='leftsidebar'>
            <div className='flex flex-col gap-11'>
                <Link to='/' className='flex gap-3 items-center'>
                    <img src="/assets/images/logo.svg"
                        alt="logo"
                        width={170}
                        height={36}
                    />
                </Link>

                <Link
                    to={`/profile/${user.id}`}
                    className='flex-center gap-3 items-center'>
                    <img src={user.imageUrl || '/assets/icons/profile-placeholder.svg'} alt="profile"
                        className='h-14 w-14 rounded-full object-cover' />

                    <div className='flex flex-col '>
                        <p className='body-bold'>
                            {user.name}
                        </p>

                        <p className='small-regular text-light-3'>
                            @{user.username}
                        </p>
                    </div>
                </Link>

                <ul className='flex flex-col gap-6'>
                    {sidebarLinks.map((link) => {
                        const isActive = pathname === link.route;
                        return (
                            <li className={`leftsidebar-link group ${
                                isActive && 'bg-primary-500'
                            }`} key={link.label}>
                                <NavLink to={link.route}
                                className='flex gap-4 p-4 items-center'
                                >
                                    <img src={link.imgURL}
                                    alt={link.label} 
                                    className={`group-hover:invert-white ${isActive && 'invert-white'}`} />
                                    {link.label}
                                </NavLink>
                            </li>
                        )
                    })}
                </ul>
            </div>

            <Button 
                variant= "ghost" 
                className='shad-button_ghost' 
                onClick={() => signOut()}
                >
                    <img src="assets/icons/logout.svg"
                    alt="logout"
                    
                    />
                    <p className='small-medium lg:base-medium'>Logout</p>
                </Button>
        </nav>
    )
}

export default LeftSidebar