import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { InputField } from "../Components/Fields/InputField";
import { Toaster, toast } from "react-hot-toast";
import Loader from "../Components/Loader";

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true); // Set loading state to true when form submission starts

    const payload = {
      username: data.username,
      password: data.password,
    };

    // Axios configuration (replace with your API URL)
    const config = {
      method: "post",
      url: "http://localhost:5000/login", // Replace with your actual login API endpoint
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(payload),
    };

    // Send data to API
    try {
      const response = await axios.request(config);
      console.log("Response:", response.data);

      // Show success toast notification
      toast.success("Login successful!");

      // Handle successful login response message
      if (response.data.message) {
        toast.success(response.data.message);
        console.log("Login successful:", response);
      }
    } catch (error) {
      console.error("Login failed:", error);

      // Check if the error response contains specific error messages
      if (error.response && error.response.data) {
        if (
          error.response.data.message === "User not found" ||
          error.response.data.message === "Password Not Match"
        ) {
          toast.error("Add Correct Credentials");
        } else {
          toast.error("Login failed. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false); // Reset loading state after the request is complete
    }
  };

  return (
    // <div>
    //   <Toaster position="top-right" reverseOrder={false} />
    //   {isLoading && <Loader />} {/* Show loader when loading is true */}
    //   <form onSubmit={handleSubmit(onSubmit)}>
    //     <div className="grid gap-6 mb-6 md:grid-cols-1">
    //       <InputField
    //         label="Username"
    //         name="username"
    //         placeholder="Enter your username"
    //         register={register}
    //         validation={{ required: "Username is required" }}
    //         error={errors.username}
    //       />
    //       <InputField
    //         label="Password"
    //         name="password"
    //         placeholder="Enter your password"
    //         register={register}
    //         type="password" // Set input type as password
    //         validation={{
    //           required: "Password is required",
    //           minLength: {
    //             value: 5,
    //             message: "Password must be at least 5 characters",
    //           },
    //         }}
    //         error={errors.password}
    //       />
    //     </div>

    //     <button
    //       type="submit"
    //       className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    //       disabled={isLoading} // Disable the button while loading
    //     >
    //       {isLoading ? "Logging in..." : "Login"}{" "}
    //       {/* Change button text based on loading state */}
    //     </button>
    //   </form>
    // </div>

    <div className="flex justify-center items-center min-h-[80vh] bg-gray-100 rounded-md">
      <Toaster position="top-right" reverseOrder={false} />
      {isLoading && <Loader />} {/* Show loader when loading is true */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96 md:w-1/3 lg:w-1/2"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

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
            type="password" // Set input type as password
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
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          disabled={isLoading} // Disable the button while loading
        >
          {isLoading ? "Logging in..." : "Login"}{" "}
          {/* Change button text based on loading state */}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
