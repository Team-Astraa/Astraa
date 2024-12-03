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
    const type = e.target.innerText;
    setUserType(type);
  };

  console.log("USER TYPE", userType);

  const getUser = (userType) => {
    let data = { userType: userType };
    console.log("User Type in get user", data);
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
    <div style={{
      backgroundImage: "url(/sea3_bg.jpg)",
      backgroundSize: "cover",
    }}>
      {!openModal ? (
        <AnimationWrapper className="w-full min-h-screen">
           <h1 className="text-bold text-3xl text-center text-white font-bold p-5">
              Un Verified Users{" "}
            </h1>
            <div
            className="flex justify-end items-center mr-10">
            <strong className="mr-2">Category: </strong>
            <select
              onChange={(e) => setType(e.target.value)}
              className="border-2 border-gray-400 bg-gray-300 text-lg text-gray-700 rounded-full focus:outline-none hover:bg-white hover:text-blue-900 hover:shadow-md transition-all duration-300"
            >
                <option value="All">All</option>
                {[
                  "Fisherman",
                  "Industry Collaborators",
                  "Research Institute",
                  "Research Cruises",
                  "Scientist",
                ].map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
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
                <h1 className="text-center mt-12 text-red-900 text-sm">
                  Please Select The Categories{" "}
                </h1>
              )}
            </div>
          </div>
        </AnimationWrapper>
      ) : (
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
    </div>
  );
};

export default Adminverifyuser;
