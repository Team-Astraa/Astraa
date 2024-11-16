import React, { useEffect, useState } from 'react'


import { Button, Modal } from "flowbite-react";
import AnimationWrapper from './Animation-page';
import axios from 'axios';
import toast from 'react-hot-toast';


const Adminverifyuser = () => {

    const [users, setUser] = useState([])
    const [userType, setUserType] = useState("")
    const [openModal, setOpenModal] = useState(false);
    const [detailData, setDetailData] = useState("")

    useEffect(() => {
        // Run this effect whenever userType changes
        if (userType) {
            getUser(userType);
        }
    }, [userType]);

    const setType = (e) => {
        setUserType(e.target.innerText);
    };

    const getUser = (userType) => {
        let data = { userType: userType };


        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:5000/admin/getUnverifiesUsers',
            headers: {
                'Content-Type': 'application/json',
            },
            data: data,
        };

        axios
            .request(config)
            .then((response) => {
                setUser(response.data.users);
            })
            .catch((error) => {
                console.log(error);
            });
    };


    const verifyUser = (id) => {

        const loader = toast.loading("verifying user...")

        let data = {
            id: id
        }

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:5000/admin/verifyUser',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                if (response.status == 200) {
                    toast.dismiss(loader)
                    toast.success("user verified successfully")
                    getUser(userType);
                }
            })
            .catch((error) => {
                toast.dismiss(loader)
                console.log(error);
            });


    }


    const getDetails = (id, type) => {
        const loader = toast.loading("getting detail data...")

        let data = {
            userId: id,
            userType: type

        }

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:5000/admin/get-detail-data',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                if (response.status == 200) {
                    console.log(response.data);
                    setDetailData(response.data.detail)

                    toast.dismiss(loader)
                    toast.success("Done...")

                }
            })
            .catch((error) => {
                toast.dismiss(loader)
                console.log(error);
            });


    }

    const openmodelfunction = (id, type) => {
        setOpenModal(true)
        getDetails(id, type)
    }


    return (
        <>
            {
                !openModal ? <AnimationWrapper className='w-full min-h-screen'>

                    <div className='w-full flex items-center justify-between  p-4 '>
                        <h1 className='text-bold text-3xl text-center text-white font-bold'>Un Verified Users </h1>
                        <div className=''>

                            <Button.Group>
                                <Button onClick={setType} color="gray">fisherman</Button>
                                <Button onClick={setType} color="gray">industry-collaborators</Button>
                                <Button onClick={setType} color="gray">research_institute</Button>
                                <Button onClick={setType} color="gray">research_cruises</Button>
                            </Button.Group>

                        </div>
                    </div>

                    <div>


                        <div className='overflow-x-auto'>
                            {
                                users.length ? <>

                                    <div>

                                        <div className="border text-center font-bold border-gray-300 rounded-lg overflow-hidden">
                                            {/* Table Header */}
                                            <div className="flex bg-gray-200 text-gray-700 font-semibold text-sm">
                                                <div className="w-1/3 py-2 px-4">Email</div>
                                                <div className="w-1/3 py-2 px-4 text-center">See Details</div>
                                                <div className="w-1/3 py-2 px-4 text-center">Verified</div>
                                            </div>

                                            {/* Table Body */}

                                            {users.map((user, i) => (
                                                <AnimationWrapper
                                                    key={i}
                                                    transition={{ duration: 1, delay: i * 0.13 }}
                                                >
                                                    <div
                                                        key={user._id}
                                                        className="flex items-center border-b border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 transition duration-300 ease-in-out"
                                                    >
                                                        {/* Email Column */}
                                                        <div className="w-1/3 py-3 px-4 text-gray-900 dark:text-white">
                                                            {user.email}
                                                        </div>

                                                        {/* See Details Button Column */}
                                                        <div className="w-1/3 py-3 px-4 text-center">
                                                            <button
                                                                onClick={() => openmodelfunction(user._id, user.userType)}
                                                                className="py-2 px-4 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition duration-200"
                                                            >
                                                                See
                                                            </button>
                                                        </div>

                                                        {/* Verified Button Column */}
                                                        <div className="w-1/3 py-3 px-4 text-center">
                                                            {user.isVerifed ? (
                                                                <button className="py-2 px-4 bg-green-600 text-white font-bold rounded-lg">
                                                                    Yes
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => verifyUser(user._id)}
                                                                    className="py-2 px-4 bg-red-600 text-white font-bold rounded-lg"
                                                                >
                                                                    No
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </AnimationWrapper>
                                            ))}
                                        </div>

                                    </div>

                                </>
                                    :

                                    <h1 className=' text-2xl text-center  mt-12 font-bold text-white'>Please Select The Categories </h1>

                            }

                        </div>
                    </div>




                </AnimationWrapper> :
                    <Modal show={openModal} onClose={() => setOpenModal(false)}>
                        {
                            detailData.length ? <>
                                <h1>vara</h1></>
                                :
                                <h1>Loading...</h1>
                        }

                        <Modal.Footer>

                            <Button color="gray" onClick={() => setOpenModal(false)}>
                                close
                            </Button>
                        </Modal.Footer>
                    </Modal>
            }
        </>
    )
}

export default Adminverifyuser


