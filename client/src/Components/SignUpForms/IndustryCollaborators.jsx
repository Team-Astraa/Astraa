// IndustryCollaboratorForm.jsx
import React from "react";
import { useForm } from "react-hook-form";
import { InputField } from "../Fields/InputField";
import { apiConnector } from "../../ApiConnector";
const IndustryCollaboratorForm = ({ email }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  console.log("EMAIL in collab", email);

  const onSubmit = async (data) => {
    console.log(data);
    // Prepare the data to match your backend's expected structure
    const requestData = {
      email: email, // Updated to match backend field
      password: "defaultPassword123", // You might want to have a password field in your form
      role: "user",
      userType: "industry-collaborators",
      additionalDetails: {
        organisation_name: data.organisation_name, // Updated to match backend field
        organisation_type: data.organisation_type, // Updated to match backend field
        organisation_contact_number: data.organisation_contact_number, // Updated to match backend field
        registration_number: data.registration_number, // Updated to match backend field
        contact_person: {
          name: data.contact_person_name, // Updated to match backend field
          email: data.contact_person_email, // Updated to match backend field
          contact: data.contact_person_contact, // Updated to match backend field
        },
        data_contribution_type: data.data_contribution_type, // Updated to match backend field
        geographical_focus_area: data.geographical_focus_area, // Updated to match backend field
      },
    };

    // Call the apiConnector to make the API request
    try {
      const response = await apiConnector(
        "post",
        "http://localhost:5000/signup",
        requestData,
        {
          "Content-Type": "application/json",
        }
      );

      console.log("Signup successful done in backend:", response.data);
      // You can add a success message or redirect after successful signup
    } catch (error) {
      console.error("Signup failed:", error);
      // You can display an error message to the user
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-6 mb-6 md:grid-cols-2">
        <InputField
          label="Organisation Name"
          name="organisation_name"
          placeholder="Organisation name"
          register={register}
          validation={{ required: "Organisation name is required" }}
          error={errors.organisation_name}
        />
        <InputField
          label="Organisation Type"
          name="organisation_type"
          placeholder="Organisation type"
          register={register}
          validation={{ required: "Organisation type is required" }}
          error={errors.organisation_type}
        />
        <InputField
          label="Organisation Contact Number"
          name="organisation_contact_number"
          placeholder="Contact number"
          register={register}
          validation={{
            required: "Contact number is required",
          }}
          error={errors.organisation_contact_number}
        />
        <InputField
          label="Registration Number"
          name="registration_number"
          placeholder="Registration number"
          register={register}
          validation={{ required: "Registration number is required" }}
          error={errors.registration_number}
        />
        <InputField
          label="Contact Person Name"
          name="contact_person_name"
          placeholder="Contact person name"
          register={register}
          validation={{ required: "Contact person name is required" }}
          error={errors.contact_person_name}
        />
        <InputField
          label="Contact Person Email"
          name="contact_person_email"
          type="email"
          placeholder="Contact person email"
          register={register}
          validation={{
            required: "Contact person email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Invalid email format",
            },
          }}
          error={errors.contact_person_email}
        />
        <InputField
          label="Contact Person Contact"
          name="contact_person_contact"
          placeholder="Contact person contact"
          register={register}
          validation={{
            required: "Contact person contact is required",
            pattern: {
              value: /^[0-9]+$/,
              message: "Contact must contain only numbers",
            },
          }}
          error={errors.contact_person_contact}
        />
        <InputField
          label="Data Contribution Type"
          name="data_contribution_type"
          placeholder="Data contribution type"
          register={register}
          validation={{ required: "Data contribution type is required" }}
          error={errors.data_contribution_type}
        />
        <InputField
          label="Geographical Focus Area"
          name="geographical_focus_area"
          placeholder="Geographical focus area"
          register={register}
          validation={{ required: "Geographical focus area is required" }}
          error={errors.geographical_focus_area}
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

export default IndustryCollaboratorForm;
