// import React, { useEffect, useState } from "react";
// import { Button } from "flowbite-react";

// import { Table } from "flowbite-react";
// import AnimationWrapper from "./Animation-page";
// import axios from "axios";
// import toast from "react-hot-toast";

// const Adminverifyuser = () => {
//   const [users, setUser] = useState([]);
//   const [userType, setUserType] = useState("");

//   useEffect(() => {
//     // Run this effect whenever userType changes
//     if (userType) {
//       getUser(userType);
//     }
//   }, [userType]);

//   const setType = (e) => {
//     setUserType(e.target.innerText);
//   };

//   const getUser = (userType) => {
//     let data = { userType: userType };

//     let config = {
//       method: "post",
//       maxBodyLength: Infinity,
//       url: "http://localhost:5000/admin/getUnverifiesUsers",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       data: data,
//     };

//     axios
//       .request(config)
//       .then((response) => {
//         setUser(response.data.users);
//         console.log("USERS ",response)
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   const verifyUser = (id) => {
//     const loader = toast.loading("verifying user...");

//     let data = {
//       id: id,
//     };

//     let config = {
//       method: "post",
//       maxBodyLength: Infinity,
//       url: "http://localhost:5000/admin/verifyUser",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       data: data,
//     };

//     axios
//       .request(config)
//       .then((response) => {
//         if (response.status == 200) {
//           toast.dismiss(loader);
//           toast.success("user verified successfully");
//           getUser(userType);
//         }
//       })
//       .catch((error) => {
//         toast.dismiss(loader);
//         console.log(error);
//       });
//   };

//   const getDetails = (id, type) => {
//     const loader = toast.loading("getting detail data...");

//     let data = {
//       userId: id,
//       userType: type,
//     };

//     let config = {
//       method: "post",
//       maxBodyLength: Infinity,
//       url: "http://localhost:5000/admin/get-detail-data",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       data: data,
//     };

//     axios
//       .request(config)
//       .then((response) => {
//         if (response.status == 200) {
//           console.log("response.data in get Deatial", response.data);

//           toast.dismiss(loader);
//           toast.success("Done...");
//         }
//       })
//       .catch((error) => {
//         toast.dismiss(loader);
//         console.log(error);
//       });
//   };

//     return (
//         <AnimationWrapper className='w-full min-h-screen'>

//             <div className='w-full flex items-center justify-between  p-4 '>
//                 <h1 className='text-bold text-3xl text-center text-white font-bold'>Un Verified Users </h1>
//                 <div className=''>

//                     <Button.Group>
//                         <Button onClick={setType} color="gray">fisherman</Button>
//                         <Button onClick={setType} color="gray">industry-collaborators</Button>
//                         <Button onClick={setType} color="gray">research_institute</Button>
//                         <Button onClick={setType} color="gray">research_cruises</Button>
//                     </Button.Group>

//                 </div>
//             </div>

//             <div>

 
//     <AnimationWrapper className="w-full min-h-screen">
//       <div className="w-full flex items-center justify-center h-[10vh] shadow-md">
//         <h1 className="text-bold text-3xl text-center">Un Verified Users </h1>
//       </div>

//       <div>
//         <div className="w-full flex items-center justify-center m-4">
//           <Button.Group>
//             <Button onClick={setType} color="gray">
//               fisherman
//             </Button>
//             <Button onClick={setType} color="gray">
//               industry-collaborators
//             </Button>
//             <Button onClick={setType} color="gray">
//               research_institute
//             </Button>
//             <Button onClick={setType} color="gray">
//               research_cruises
//             </Button>
//           </Button.Group>
//         </div>

//                 <div className='overflow-x-auto'>
//                     {
//                         users.length ? <>

//                             <div>

//                                 <div className="border text-center font-bold border-gray-300 rounded-lg overflow-hidden">
//                                     {/* Table Header */}
//                                     <div className="flex bg-gray-200 text-gray-700 font-semibold text-sm">
//                                         <div className="w-1/3 py-2 px-4">Email</div>
//                                         <div className="w-1/3 py-2 px-4 text-center">See Details</div>
//                                         <div className="w-1/3 py-2 px-4 text-center">Verified</div>
//                                     </div>
//         <div className="overflow-x-auto">
//           {users.length ? (
//             <>
//               <div>
//                 {userType === "research_cruises" ? (
//                   <div className="w-full border border-gray-300 rounded-lg overflow-hidden">
//                     {/* Table Header */}
//                     <div className="flex bg-gray-200 text-gray-700 font-semibold text-sm">
//                       <div className="w-1/3 py-2 px-4">Email</div>
//                       <div className="w-1/3 py-2 px-4 text-center">
//                         See Details
//                       </div>
//                       <div className="w-1/3 py-2 px-4 text-center">
//                         Verified
//                       </div>
//                     </div>

//                                     {/* Table Body */}
//                     {/* Table Body */}

//                                     {users.map((user, i) => (
//                                         <AnimationWrapper
//                                             key={i}
//                                             transition={{ duration: 1, delay: i * 0.13 }}
//                                         >
//                                             <div
//                                                 key={user._id}
//                                                 className="flex items-center border-b border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 transition duration-300 ease-in-out"
//                                             >
//                                                 {/* Email Column */}
//                                                 <div className="w-1/3 py-3 px-4 text-gray-900 dark:text-white">
//                                                     {user.email}
//                                                 </div>
//                     {users.map((user, i) => (
//                       <AnimationWrapper
//                         key={i}
//                         transition={{ duration: 1, delay: i * 0.13 }}
//                       >
//                         <div
//                           key={user._id}
//                           className="flex items-center border-b border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 transition duration-300 ease-in-out"
//                         >
//                           {/* Email Column */}
//                           <div className="w-1/3 py-3 px-4 text-gray-900 dark:text-white">
//                             {user.email}
//                           </div>

//                                                 {/* See Details Button Column */}
//                                                 <div className="w-1/3 py-3 px-4 text-center">
//                                                     <button
//                                                         onClick={() => getDetails(user._id, user.userType)}
//                                                         className="py-2 px-4 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition duration-200"
//                                                     >
//                                                         See
//                                                     </button>
//                                                 </div>
//                           {/* See Details Button Column */}
//                           <div className="w-1/3 py-3 px-4 text-center">
//                             <button
//                               onClick={() =>
//                                 getDetails(user._id, user.userType)
//                               }
//                               className="py-2 px-4 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition duration-200"
//                             >
//                               See
//                             </button>
//                           </div>

//                                                 {/* Verified Button Column */}
//                                                 <div className="w-1/3 py-3 px-4 text-center">
//                                                     {user.isVerifed ? (
//                                                         <button className="py-2 px-4 bg-green-600 text-white font-bold rounded-lg">
//                                                             Yes
//                                                         </button>
//                                                     ) : (
//                                                         <button
//                                                             onClick={() => verifyUser(user._id)}
//                                                             className="py-2 px-4 bg-red-600 text-white font-bold rounded-lg"
//                                                         >
//                                                             No
//                                                         </button>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </AnimationWrapper>
//                                     ))}
//                                 </div>

//                             </div>

//                         </>
//                             :

//                             <h1 className=' text-2xl text-center  mt-12 font-bold text-white'>Please Select The Categories </h1>

//                     }

//                 </div>
//             </div>




//         </AnimationWrapper>
//     )
// }
//                           {/* Verified Button Column */}
//                           <div className="w-1/3 py-3 px-4 text-center">
//                             {user.isVerifed ? (
//                               <button className="py-2 px-4 bg-green-600 text-white font-bold rounded-lg">
//                                 Yes
//                               </button>
//                             ) : (
//                               <button
//                                 onClick={() => verifyUser(user._id)}
//                                 className="py-2 px-4 bg-red-600 text-white font-bold rounded-lg"
//                               >
//                                 No
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       </AnimationWrapper>
//                     ))}
//                   </div>
//                 ) : (
//                   <p>hii</p>
//                 )}
//               </div>
//             </>
//           ) : (
//             <h1 className=" text-2xl text-center  mt-12 font-bold">
//               Please Select The Categories{" "}
//             </h1>
//           )}
//         </div>
//       </div>
//     </AnimationWrapper>
//   );
// };

// export default Adminverifyuser;




import React, { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import AnimationWrapper from "./Animation-page";
import axios from "axios";
import toast from "react-hot-toast";

const Adminverifyuser = () => {
  const [users, setUsers] = useState([]);
  const [userType, setUserType] = useState("");

  useEffect(() => {
    if (userType) {
      getUser(userType);
    }
  }, [userType]);

  const setType = (e) => {
    setUserType(e.target.innerText);
  };

  const getUser = (userType) => {
    const data = { userType };
    const config = {
      method: "post",
      url: "http://localhost:5000/admin/getUnverifiesUsers",
      headers: { "Content-Type": "application/json" },
      data,
    };

    axios
      .request(config)
      .then((response) => {
        setUsers(response.data.users);
        console.log("Users:", response.data.users);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const verifyUser = (id) => {
    const loader = toast.loading("Verifying user...");
    const data = { id };

    axios
      .post("http://localhost:5000/admin/verifyUser", data)
      .then((response) => {
        if (response.status === 200) {
          toast.dismiss(loader);
          toast.success("User verified successfully");
          getUser(userType);
        }
      })
      .catch((error) => {
        toast.dismiss(loader);
        console.error(error);
      });
  };

  const getDetails = (id, type) => {
    const loader = toast.loading("Getting detail data...");
    const data = { userId: id, userType: type };

    axios
      .post("http://localhost:5000/admin/get-detail-data", data)
      .then((response) => {
        toast.dismiss(loader);
        console.log("Details:", response.data);
        toast.success("Details fetched successfully");
      })
      .catch((error) => {
        toast.dismiss(loader);
        console.error(error);
      });
  };

  return (
    <AnimationWrapper className="w-full min-h-screen">
      <div className="w-full flex items-center justify-between p-4">
        <h1 className="text-bold text-3xl text-white font-bold">
          Unverified Users
        </h1>
        <div>
          <Button.Group>
            <Button onClick={setType} color="gray">
              fisherman
            </Button>
            <Button onClick={setType} color="gray">
              industry-collaborators
            </Button>
            <Button onClick={setType} color="gray">
              research_institute
            </Button>
            <Button onClick={setType} color="gray">
              research_cruises
            </Button>
          </Button.Group>
        </div>
      </div>

      <div className="overflow-x-auto">
        {users.length > 0 ? (
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
                key={user._id}
                transition={{ duration: 1, delay: i * 0.13 }}
              >
                <div className="flex items-center border-b border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700">
                  {/* Email Column */}
                  <div className="w-1/3 py-3 px-4 text-gray-900 dark:text-white">
                    {user.email}
                  </div>
                  {/* See Details Button Column */}
                  <div className="w-1/3 py-3 px-4 text-center">
                    <button
                      onClick={() => getDetails(user._id, user.userType)}
                      className="py-2 px-4 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
                    >
                      See
                    </button>
                  </div>
                  {/* Verified Button Column */}
                  <div className="w-1/3 py-3 px-4 text-center">
                    {user.isVerified ? (
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
        ) : (
          <h1 className="text-2xl text-center mt-12 font-bold text-white">
            Please Select The Categories
          </h1>
        )}
      </div>
    </AnimationWrapper>
  );
};

export default Adminverifyuser;
