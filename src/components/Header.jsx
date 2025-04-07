import React from 'react'
import { NavLink } from 'react-router'
import { SidebarTrigger } from './ui/Sidebar'

const Header = () => {
    return (
        <header className='flex items-center justify-between p-4 bg-background text-foreground border-b-primary border-b-2'>
            <div className='flex items-center space-x-4'>
                <SidebarTrigger />
                <h2 className='text-2xl font-semibold'>YARCL</h2>
                <nav className='flex space-x-4'>
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive ? "text-accent-foreground" : ""
                        }
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/components"
                        className={({ isActive }) =>
                            isActive ? "text-accent-foreground" : ""
                        }
                    >
                        Components
                    </NavLink>
                </nav>
            </div>
        </header>
    )
}

export default Header