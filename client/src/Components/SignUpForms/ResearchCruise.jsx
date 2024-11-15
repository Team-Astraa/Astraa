// ResearchCruiseForm.jsx
import React from "react";
import { useForm } from "react-hook-form";
import { InputField } from "../Fields/InputField";

const ResearchCruiseForm = ({ email }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  console.log("EMAIL in cruise", email);
  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-6 mb-6 md:grid-cols-2">
        <InputField
          label="Cruise Name"
          name="cruiseName"
          placeholder="Enter cruise name"
          register={register}
          validation={{ required: "Cruise name is required" }}
          error={errors.cruiseName}
        />
        <InputField
          label="Cruise ID"
          name="cruiseId"
          placeholder="Enter cruise ID"
          register={register}
          validation={{ required: "Cruise ID is required" }}
          error={errors.cruiseId}
        />
        <InputField
          label="Research Institution"
          name="researchInstitution"
          placeholder="Enter institution name"
          register={register}
          validation={{ required: "Research institution is required" }}
          error={errors.researchInstitution}
        />
        <InputField
          label="Cruise Area"
          name="cruiseArea"
          placeholder="Enter cruise area"
          register={register}
          validation={{ required: "Cruise area is required" }}
          error={errors.cruiseArea}
        />
        <InputField
          label="Objective of Cruise"
          name="objectiveOfCruise"
          placeholder="Enter objective"
          register={register}
          validation={{ required: "Objective of cruise is required" }}
          error={errors.objectiveOfCruise}
        />
        <InputField
          label="Contact Number"
          name="contactNumber"
          placeholder="123-456-7890"
          register={register}
          validation={{
            required: "Contact number is required",
          }}
          error={errors.contactNumber}
        />
        <InputField
          label="Email"
          name="email"
          placeholder="Enter email address"
          register={register}
          validation={{
            required: "Email is required",
            pattern: {
              value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
              message: "Invalid email address",
            },
          }}
          error={errors.email}
        />
      </div>

      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Submit
      </button>
    </form>
  );
};

export default ResearchCruiseForm;
