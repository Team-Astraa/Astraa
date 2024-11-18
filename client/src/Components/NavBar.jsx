import React from 'react'
import logo from '../assets/navlogo.png'

const NavBar = () => {
    return (
        <div className='flex w-full items-center justify-between h-[10vh] border-b-2 border-[#436ec677]'
        
        >
            <div>
                <h1 className='text-3xl font-bold text-white'>Fish Catch repo</h1>

            </div>
            <div className='mx-4'>
                <img className='w-[150px] rounded-md' src={logo} alt="logo" />
            </div>
        </div>
    )
}

export default NavBar