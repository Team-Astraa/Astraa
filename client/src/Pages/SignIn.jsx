import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { InputField } from "../Components/Fields/InputField";
import { Toaster, toast } from "react-hot-toast";
import Loader from "../Components/Loader";
import { Link, useNavigate } from "react-router-dom";
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

        // Save the object in localStorage as a JSON string
        localStorage.setItem("aquaUser", JSON.stringify(userData));

        toast.success(response.data.message);
        if (response.data.userType == 'scientist') {
          return navigate("/scientist/home");

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

  return (
    <div className="h-screen flex h-[87vh] bg-gradient-to-r from-blue-900 to-blue-500">
      {/* Left Section */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 bg-white p-12">
        <Toaster position="top-right" reverseOrder={false} />
        {isLoading && <Loader />}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl"
        >
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">
            Welcome Back
          </h2>

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

          <button
            type="submit"
            className="text-white bg-gradient-to-br from-blue-500 to-blue-900 hover:from-blue-500 hover:to-blue-900 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg w-full py-3"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Sign In"}
          </button>

          <p className="text-center text-gray-600 mt-4">
            Don't have an account?{" "}
            <a href="/SignUp" className="text-blue-500 font-semibold">
              Sign Up
            </a>
          </p>
        </form>
      </div>

      {/* Right Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-500 to-blue-900 justify-center items-center text-white">
        <div className="text-center px-8">
          <h1 className="text-5xl font-bold mb-4">Welcome to AquaDB!</h1>
          <p className="text-xl">
            Unlock your potential and start your journey with us today.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
