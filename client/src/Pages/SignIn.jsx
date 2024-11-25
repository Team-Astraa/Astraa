import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { InputField } from "../Components/Fields/InputField";
import { Toaster, toast } from "react-hot-toast";
import Loader from "../Components/Loader";
import { Link, useNavigate } from "react-router-dom";
import AnimationWrapper from "./Animation-page";
import { Checkbox } from "@mui/material";

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);

    const payload = {
      username: data.username,
      password: data.password,
    };

    const config = {
      method: "post",
      url: "http://localhost:5000/login",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(payload),
    };

    try {
      const response = await axios.request(config);
      toast.success("Login successful!");

      if (response.data.message) {
        // Create an object to store all data
        const userData = {
          token: response.data.token,
          userType: response.data.userType,
          userId: response.data.userid,
        };

        console.log("userData", userData);
        // Save the object in localStorage as a JSON string
        localStorage.setItem("aquaUser", JSON.stringify(userData));

        toast.success(response.data.message);
        if (response.data.userType == "scientist") {
          return navigate("/scientist/home");
        }
        if (response.data.userType == "admin") {
          return navigate("/admin/home");
        }
        navigate("/");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const message = error.response.data.message;
        if (message === "User not found" || message === "Password Not Match") {
          toast.error("Add Correct Credentials");
        } else {
          toast.error("Login failed. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {

    let user = localStorage.getItem("aquaUser");
    let userInses = JSON.parse(user)
    if (user) {
      if (userInses.userType == "admin") {
        return navigate("/admin/home");
      } else if (userInses.userType == "scientist") {
        return navigate("/scientist/home");
      }
      return navigate("/")

    }

  }, [])

  return (
    <AnimationWrapper className="h-[100vh] flex bg-gradient-to-r from-blue-900 to-blue-500 mx-auto ">
      {/* Left Section */}
      <div className="flex flex-col justify-center items-center w-full lg:w-[60vw] bg-white">
        <Toaster position="top-right" reverseOrder={false} />
        {/* {isLoading && <Loader />} */}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[70%] bg-white rounded-2xl">

          <h2 style={{fontFamily: "sans-serif"}} className="text-6xl text-gray-800 text-center mb-2  font-bold" >
            Welcome Back!
          </h2>

          <p className="text-center text-lg text-gray-600 mb-12">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 font-semibold">
              Sign Up
            </Link>
          </p>

          <div className="grid gap-6 mb-6">
            <InputField
              label="Username"
              name="username"
              placeholder="Enter your username"
              register={register}
              validation={{ required: "Username is required" }}
              error={errors.username}
            />
            <InputField
              label="Password"
              name="password"
              placeholder="Enter your password"
              register={register}
              type="password"
              validation={{
                required: "Password is required",
                minLength: {
                  value: 5,
                  message: "Password must be at least 5 characters",
                },
              }}
              error={errors.password}
            />
          </div>

          <div className="extra flex items-center justify-between" >
            <div className="flex items-center">
              <Checkbox />
              <p>Remember me</p>
            </div>
            <p className="font-semibold text-blue-500">Forgot Password?</p>
          </div>

          <div className="w-full flex mt-10">
          <button
            type="submit"
            className="text-white bg-gradient-to-br from-blue-500 to-blue-900 hover:from-blue-500 hover:to-blue-900 focus:ring-4 focus:ring-blue-300 font-medium rounded-3xl text-lg w-[50%] py-3 mx-auto"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Sign In"}
          </button>
          </div>
          
        </form>
        
      </div>

      {/* Right Section */}
      <div className="bg-white">
        <div className="hidden lg:flex lg:w-[40vw] bg-gradient-to-br from-blue-500 to-blue-900 justify-center items-center text-white h-full"
        style={{backgroundImage: "url(../../sea_bg.jpg)", backgroundRepeat: "no-repeat", backgroundSize: "cover", borderRadius: "4rem 0 0 4rem"}}>
          {/* <div className="text-center22 px-8">
            <h1 className="text-5xl font-bold mb-4">Welcome to AquaDB!</h1>
            <p className="text-xl">
              Unlock your potential and start your journey with us today.
            </p>
          </div> */}

        </div>
      </div>
    </AnimationWrapper>
  );
};

export default LoginForm;
