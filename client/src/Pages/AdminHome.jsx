import React, { useEffect, useState } from 'react'
import { Button, Card } from "flowbite-react";
import userImg from '../assets/users.png'
import fishImg from '../assets/fishes.png'
import { useNavigate } from 'react-router-dom';
import AnimationWrapper from "./Animation-page"
import toast from 'react-hot-toast';
import AdminUpperStrip from '../Components/AdminUpperStrip';
import UserTypeCount from '../Components/UserTypeCount';
import Logs from '../Components/Admin-user-logs';

const AdminHome = () => {


  const navigate = useNavigate()
  useEffect(() => {
    let user = localStorage.getItem('aquaUser')
    let userInsession = JSON.parse(user)
    if (userInsession && userInsession.userType !== 'admin') {
      toast.error("You cannot access this page")
      navigate('/signin')
      return;

    }

  }, [])





  return (
    <AnimationWrapper className='h-auto p-4'>

      {/* <div className='flex items-center justify-center h-[10vh] shadow-md'>
        <h1 className='text-bold text-3xl text-center text-white'>ADMIN PORTAL</h1>
      </div> */}


      <AdminUpperStrip />

      <div className='w-full flex gap-4'>
        <div className="flex flex-col space-y-4 w-[70%] p-4">


          <Logs />

        </div>


        <div className='w-[30%]'>
          <UserTypeCount />

        </div>
      </div>
      <button
        className="max-w-sm relative py-4 px-6 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition duration-200 flex items-center justify-center"
        style={{ backgroundImage: `url(${userImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        onClick={() => navigate('/admin/unverify-user')}
      >
        <div className="absolute inset-0 bg-black opacity-30 rounded-lg"></div>
        <span className="relative z-10 text-2xl font-bold text-center">
          Verify Users
        </span>
      </button>
    </AnimationWrapper>
  )
}

export default AdminHome