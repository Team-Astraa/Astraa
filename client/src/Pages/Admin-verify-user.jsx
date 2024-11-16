import React, { useEffect, useState } from "react";

import { Button, Modal } from "flowbite-react";
import AnimationWrapper from "./Animation-page";
import axios from "axios";
import toast from "react-hot-toast";

const Adminverifyuser = () => {
  const [users, setUser] = useState([]);
  const [userType, setUserType] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [detailData, setDetailData] = useState("");

  useEffect(() => {
    // Run this effect whenever userType changes
    if (userType) {
      getUser(userType);
    }
  }, [userType]);

  const setType = (e) => {
    setUserType(e.target.innerText);
  };

  console.log("USER TYPE", userType);

  const getUser = (userType) => {
    let data = { userType: userType };

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:5000/admin/getUnverifiesUsers",
      headers: {
        "Content-Type": "application/json",
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
    const loader = toast.loading("verifying user...");

    let data = {
      id: id,
    };

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:5000/admin/verifyUser",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.status == 200) {
          toast.dismiss(loader);
          toast.success("user verified successfully");
          getUser(userType);
        }
      })
      .catch((error) => {
        toast.dismiss(loader);
        console.log(error);
      });
  };

  const getDetails = (id, type) => {
    const loader = toast.loading("getting detail data...");

    let data = {
      userId: id,
      userType: type,
    };

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:5000/admin/get-detail-data",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.status == 200) {
          console.log(response.data);
          setDetailData(response.data.detail);

          toast.dismiss(loader);
          toast.success("Done...");
        }
      })
      .catch((error) => {
        toast.dismiss(loader);
        console.log(error);
      });
  };

  const openmodelfunction = (id, type) => {
    setOpenModal(true);
    getDetails(id, type);
  };

  return (
    <>
      {!openModal ? (
        <AnimationWrapper className="w-full min-h-screen">
          <div className="w-full flex items-center justify-between  p-4 ">
            <h1 className="text-bold text-3xl text-center text-white font-bold">
              Un Verified Users{" "}
            </h1>
            <div className="">
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

          <div>
            <div className="overflow-x-auto">
              {users.length ? (
                <>
                  <div>
                    <div className="border text-center font-bold border-gray-300 rounded-lg overflow-hidden">
                      {/* Table Header */}
                      <div className="flex bg-gray-200 text-gray-700 font-semibold text-sm">
                        <div className="w-1/3 py-2 px-4">Email</div>
                        <div className="w-1/3 py-2 px-4 text-center">
                          See Details
                        </div>
                        <div className="w-1/3 py-2 px-4 text-center">
                          Verified
                        </div>
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
                                onClick={() =>
                                  openmodelfunction(user._id, user.userType)
                                }
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
              ) : (
                <h1 className=" text-2xl text-center  mt-12 font-bold text-white">
                  Please Select The Categories{" "}
                </h1>
              )}
            </div>
          </div>
        </AnimationWrapper>
      ) : (
        // <Modal show={openModal} onClose={() => setOpenModal(false)}>
        //     {
        //         detailData.length ? <>
        //             <h1>vara</h1></>
        //             :
        //             <h1>Loading...</h1>
        //     }

        //     <Modal.Footer>

        //         <Button color="gray" onClick={() => setOpenModal(false)}>
        //             close
        //         </Button>
        //     </Modal.Footer>
        // </Modal>
        // <Modal show={openModal} onClose={() => setOpenModal(false)}>
        //   {detailData.length ? (
        //     <>
        //       {detailData.map((data, index) => (
        //         <div key={index} className="space-y-4">
        //           {/* Check the userType and render the appropriate data */}
        //           {userType === "fisherman" ? (
        //             <>
        //               <h1 className="text-2xl font-semibold mb-4">
        //                 Fishermen Details
        //               </h1>
        //               <div className="space-y-2">
        //                 <p>
        //                   <strong className="font-semibold">
        //                     Contact Person:
        //                   </strong>{" "}
        //                   {data.contact_person.name}
        //                 </p>
        //                 <p>
        //                   <strong className="font-semibold">
        //                     Contact Person Email:
        //                   </strong>{" "}
        //                   {data.contact_person.email}
        //                 </p>
        //                 <p>
        //                   <strong className="font-semibold">
        //                     Contact Person Contact:
        //                   </strong>{" "}
        //                   {data.contact_person.contact}
        //                 </p>
        //                 <p>
        //                   <strong className="font-semibold">
        //                     Organisation Name:
        //                   </strong>{" "}
        //                   {data.organisation_name}
        //                 </p>
        //                 <p>
        //                   <strong className="font-semibold">
        //                     Organisation Type:
        //                   </strong>{" "}
        //                   {data.organisation_type}
        //                 </p>
        //                 <p>
        //                   <strong className="font-semibold">
        //                     Organisation Contact Number:
        //                   </strong>{" "}
        //                   {data.organisation_contact_number}
        //                 </p>
        //                 <p>
        //                   <strong className="font-semibold">
        //                     Registration Number:
        //                   </strong>{" "}
        //                   {data.registration_number}
        //                 </p>
        //                 <p>
        //                   <strong className="font-semibold">
        //                     Data Contribution Type:
        //                   </strong>{" "}
        //                   {data.data_contribution_type}
        //                 </p>
        //                 <p>
        //                   <strong className="font-semibold">
        //                     Geographical Focus Area:
        //                   </strong>{" "}
        //                   {data.geographical_focus_area}
        //                 </p>
        //               </div>
        //             </>
        //           ) : userType === "industry-collaborators" ? (
        //             <>
        //               <h1 className="text-2xl font-semibold mb-4">
        //                 Industry Collaborators Details
        //               </h1>
        //               <div className="space-y-2">
        //                 <p>
        //                   <strong className="font-semibold">
        //                     Contact Person Name:
        //                   </strong>{" "}
        //                   {data.contact_person.name}
        //                 </p>
        //                 <p>
        //                   <strong className="font-semibold">
        //                     Contact Person Email:
        //                   </strong>{" "}
        //                   {data.contact_person.email}
        //                 </p>
        //                 <p>
        //                   <strong className="font-semibold">
        //                     Contact Person Contact:
        //                   </strong>{" "}
        //                   {data.contact_person.contact}
        //                 </p>
        //                 <p>
        //                   <strong className="font-semibold">
        //                     Organisation Name:
        //                   </strong>{" "}
        //                   {data.organisation_name}
        //                 </p>
        //                 <p>
        //                   <strong className="font-semibold">
        //                     Organisation Type:
        //                   </strong>{" "}
        //                   {data.organisation_type}
        //                 </p>
        //                 <p>
        //                   <strong className="font-semibold">
        //                     Organisation Contact Number:
        //                   </strong>{" "}
        //                   {data.organisation_contact_number}
        //                 </p>
        //                 <p>
        //                   <strong className="font-semibold">
        //                     Registration Number:
        //                   </strong>{" "}
        //                   {data.registration_number}
        //                 </p>
        //                 <p>
        //                   <strong className="font-semibold">
        //                     Data Contribution Type:
        //                   </strong>{" "}
        //                   {data.data_contribution_type}
        //                 </p>
        //                 <p>
        //                   <strong className="font-semibold">
        //                     Geographical Focus Area:
        //                   </strong>{" "}
        //                   {data.geographical_focus_area}
        //                 </p>
        //               </div>
        //             </>
        //           ) : userType === "research_institute" ? (
        //             <>
        //               <h1 className="text-2xl font-semibold mb-4">
        //                 Research Institute Details
        //               </h1>
        //               <div className="space-y-2">
        //                 <p>
        //                   <strong className="font-semibold">
        //                     Institution Name:
        //                   </strong>{" "}
        //                   {data.institution_name}
        //                 </p>
        //                 <p>
        //                   <strong className="font-semibold">
        //                     Institution Code:
        //                   </strong>{" "}
        //                   {data.institution_code}
        //                 </p>
        //                 <p>
        //                   <strong className="font-semibold">
        //                     Contact Number:
        //                   </strong>{" "}
        //                   {data.contact_number}
        //                 </p>
        //                 <p>
        //                   <strong className="font-semibold">Email:</strong>{" "}
        //                   {data.email}
        //                 </p>
        //                 <p>
        //                   <strong className="font-semibold">Website:</strong>{" "}
        //                   <a
        //                     href={data.website}
        //                     target="_blank"
        //                     rel="noopener noreferrer"
        //                     className="text-blue-500"
        //                   >
        //                     {data.website}
        //                   </a>
        //                 </p>
        //                 <p>
        //                   <strong className="font-semibold">Country:</strong>{" "}
        //                   {data.country}
        //                 </p>
        //                 <p>
        //                   <strong className="font-semibold">Region:</strong>{" "}
        //                   {data.region}
        //                 </p>
        //                 <p>
        //                   <strong className="font-semibold">
        //                     Research Focus:
        //                   </strong>{" "}
        //                   {data.research_focus}
        //                 </p>
        //               </div>
        //             </>
        //           ) : userType === "research_cruises" ? (
        //             <>
        //               <h1 className="text-2xl font-semibold mb-4">
        //                 Research Cruise Details
        //               </h1>
        //               <div className="space-y-2">
        //                 <p>
        //                   <strong className="font-semibold">
        //                     Cruise Name:
        //                   </strong>{" "}
        //                   {data.cruise_name}
        //                 </p>
        //                 <p>
        //                   <strong className="font-semibold">Cruise ID:</strong>{" "}
        //                   {data.cruise_id}
        //                 </p>
        //                 <p>
        //                   <strong className="font-semibold">
        //                     Research Institution:
        //                   </strong>{" "}
        //                   {data.research_institution}
        //                 </p>
        //                 <p>
        //                   <strong className="font-semibold">
        //                     Cruise Area:
        //                   </strong>{" "}
        //                   {data.cruise_area}
        //                 </p>
        //                 <p>
        //                   <strong className="font-semibold">
        //                     Objective of Cruise:
        //                   </strong>{" "}
        //                   {data.objective_of_cruise}
        //                 </p>
        //                 <p>
        //                   <strong className="font-semibold">
        //                     Contact Number:
        //                   </strong>{" "}
        //                   {data.contact_number}
        //                 </p>
        //                 <p>
        //                   <strong className="font-semibold">Email:</strong>{" "}
        //                   {data.email}
        //                 </p>
        //               </div>
        //             </>
        //           ) : (
        //             <p>No data available for this user type</p>
        //           )}
        //         </div>
        //       ))}
        //     </>
        //   ) : (
        //     <h1>Loading...</h1>
        //   )}

        //   <Modal.Footer>
        //     <Button color="gray" onClick={() => setOpenModal(false)}>
        //       Close
        //     </Button>
        //   </Modal.Footer>
        // </Modal>

        <Modal show={openModal} onClose={() => setOpenModal(false)}>
          {detailData.length ? (
            <>
              {detailData.map((data, index) => (
                <div key={index} className="space-y-2 px-4">
                  {/* Check the userType and render the appropriate data */}
                  {userType === "fisherman" ? (
                    <>
                      <h1 className="text-xl font-semibold mb-2 p-6">
                        Fishermen Details
                      </h1>
                      <div className="space-y-1">
                        {[
                          {
                            label: "Contact Person",
                            value: data.contact_person.name,
                          },
                          {
                            label: "Contact Person Email",
                            value: data.contact_person.email,
                          },
                          {
                            label: "Contact Person Contact",
                            value: data.contact_person.contact,
                          },
                          {
                            label: "Organisation Name",
                            value: data.organisation_name,
                          },
                          {
                            label: "Organisation Type",
                            value: data.organisation_type,
                          },
                          {
                            label: "Organisation Contact Number",
                            value: data.organisation_contact_number,
                          },
                          {
                            label: "Registration Number",
                            value: data.registration_number,
                          },
                          {
                            label: "Data Contribution Type",
                            value: data.data_contribution_type,
                          },
                          {
                            label: "Geographical Focus Area",
                            value: data.geographical_focus_area,
                          },
                        ].map((field, idx) => (
                          <div
                            key={idx}
                            className={`p-2 rounded-lg ${
                              idx % 2 === 0 ? "bg-gray-100" : "bg-white"
                            }`}
                          >
                            <p>
                              <strong className="font-semibold">
                                {field.label}:
                              </strong>{" "}
                              {field.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : userType === "industry-collaborators" ? (
                    <>
                      <h1 className="text-xl font-semibold mb-2 p-2">
                        Industry Collaborators Details
                      </h1>
                      <div className="space-y-1">
                        {[
                          {
                            label: "Registration Number",
                            value: data.registration_number,
                          },
                          {
                            label: "Contact Person Name",
                            value: data.contact_person.name,
                          },
                          {
                            label: "Contact Person Email",
                            value: data.contact_person.email,
                          },
                          {
                            label: "Contact Person Contact",
                            value: data.contact_person.contact,
                          },
                          {
                            label: "Organisation Name",
                            value: data.organisation_name,
                          },
                          {
                            label: "Organisation Type",
                            value: data.organisation_type,
                          },
                          {
                            label: "Organisation Contact Number",
                            value: data.organisation_contact_number,
                          },

                          {
                            label: "Data Contribution Type",
                            value: data.data_contribution_type,
                          },
                          {
                            label: "Geographical Focus Area",
                            value: data.geographical_focus_area,
                          },
                        ].map((field, idx) => (
                          <div
                            key={idx}
                            className={`p-2 rounded-lg ${
                              idx % 2 === 0 ? "bg-gray-100" : "bg-white"
                            }`}
                          >
                            <p>
                              <strong className="font-semibold">
                                {field.label}:
                              </strong>{" "}
                              {field.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : userType === "research_institute" ? (
                    <>
                      <h1 className="text-xl font-semibold mb-2 p-2">
                        Research Institute Details
                      </h1>
                      <div className="space-y-1">
                        {[
                          {
                            label: "Institution Name",
                            value: data.institution_name,
                          },
                          {
                            label: "Institution Code",
                            value: data.institution_code,
                          },
                          {
                            label: "Contact Number",
                            value: data.contact_number,
                          },
                          { label: "Email", value: data.email },
                          {
                            label: "Website",
                            value: (
                              <a
                                href={data.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500"
                              >
                                {data.website}
                              </a>
                            ),
                          },
                          { label: "Country", value: data.country },
                          { label: "Region", value: data.region },
                          {
                            label: "Research Focus",
                            value: data.research_focus,
                          },
                        ].map((field, idx) => (
                          <div
                            key={idx}
                            className={`p-2 rounded-lg ${
                              idx % 2 === 0 ? "bg-gray-100" : "bg-white"
                            }`}
                          >
                            <p>
                              <strong className="font-semibold">
                                {field.label}:
                              </strong>{" "}
                              {field.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : userType === "research_cruises" ? (
                    <>
                      <h1 className="text-xl font-semibold mb-2 p-2">
                        Research Cruise Details
                      </h1>
                      <div className="space-y-1">
                        {[
                          { label: "Cruise Name", value: data.cruise_name },
                          { label: "Cruise ID", value: data.cruise_id },
                          {
                            label: "Research Institution",
                            value: data.research_institution,
                          },
                          { label: "Cruise Area", value: data.cruise_area },
                          {
                            label: "Objective of Cruise",
                            value: data.objective_of_cruise,
                          },
                          {
                            label: "Contact Number",
                            value: data.contact_number,
                          },
                          { label: "Email", value: data.email },
                        ].map((field, idx) => (
                          <div
                            key={idx}
                            className={`p-2 rounded-lg ${
                              idx % 2 === 0 ? "bg-gray-100" : "bg-white"
                            }`}
                          >
                            <p>
                              <strong className="font-semibold">
                                {field.label}:
                              </strong>{" "}
                              {field.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p>No data available for this user type</p>
                  )}
                </div>
              ))}
            </>
          ) : (
            <h1>Loading...</h1>
          )}

          <Modal.Footer>
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default Adminverifyuser;
