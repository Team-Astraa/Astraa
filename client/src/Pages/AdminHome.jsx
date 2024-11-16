import React from 'react'
import { Button, Card } from "flowbite-react";
import userImg from '../assets/users.png'
import { useNavigate } from 'react-router-dom';

const AdminHome = () => {

  const navigate = useNavigate()
  return (
    <section className='w-full h-screen  '>

      <div className='w-full flex items-center justify-center h-[10vh] shadow-md'>
        <h1 className='text-bold text-3xl text-center'>ADMIN PAGE </h1>
      </div>
      <div className='flex w-full m-4'>
        <Card
          className="max-w-sm cursor-pointer hover:scale-105 duration-200"
          imgAlt="Meaningful alt text for an image that is not purely decorative"
          imgSrc={userImg}
          onClick={()=>navigate('/admin/unverify-user')}
        >
          <h5 className="text-2xl font-bold tracking-tight text-center text-gray-900 dark:text-white">
            
            verify Users
          </h5>
          {/* <p className="font-normal text-gray-700 dark:text-gray-400">
            Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
          </p> */}
        </Card>
      </div>
    </section>
  )
}

export default AdminHome