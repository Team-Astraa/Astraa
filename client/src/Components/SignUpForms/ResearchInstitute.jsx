// // ResearchInstituteForm.jsx
// import React from "react";
// import { useForm } from "react-hook-form";
// import { InputField } from "../Fields/InputField";

// const ResearchInstituteForm = ({email}) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   console.log("EMAIL in Institute", email);
//   const onSubmit = (data) => {
//     console.log(data);
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <div className="grid gap-6 mb-6 md:grid-cols-2">
//         <InputField
//           label="Institute Name"
//           name="instituteName"
//           placeholder="Enter institute name"
//           register={register}
//           validation={{ required: "Institute name is required" }}
//           error={errors.instituteName}
//         />
//         <InputField
//           label="Institute Code"
//           name="instituteCode"
//           placeholder="Enter institute code"
//           register={register}
//           validation={{ required: "Institute code is required" }}
//           error={errors.instituteCode}
//         />
//         <InputField
//           label="Contact Number"
//           name="contactNumber"
//           placeholder="123-456-7890"
//           register={register}
//           validation={{
//             required: "Contact number is required",
//           }}
//           error={errors.contactNumber}
//         />
//         <InputField
//           label="Email"
//           name="email"
//           placeholder="Enter email address"
//           register={register}
//           validation={{
//             required: "Email is required",
//             pattern: {
//               value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
//               message: "Invalid email address",
//             },
//           }}
//           error={errors.email}
//         />
//         <InputField
//           label="Website"
//           name="website"
//           placeholder="Enter website URL"
//           register={register}
//           validation={{ required: "Website is required" }}
//           error={errors.website}
//         />
//         <InputField
//           label="Country"
//           name="country"
//           placeholder="Enter country"
//           register={register}
//           validation={{ required: "Country is required" }}
//           error={errors.country}
//         />
//         <InputField
//           label="Region"
//           name="region"
//           placeholder="Enter region"
//           register={register}
//           validation={{ required: "Region is required" }}
//           error={errors.region}
//         />
//         <InputField
//           label="Research Focus"
//           name="researchFocus"
//           placeholder="Enter research focus"
//           register={register}
//           validation={{ required: "Research focus is required" }}
//           error={errors.researchFocus}
//         />
//       </div>

//       <button
//         type="submit"
//         className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
//       >
//         Submit
//       </button>
//     </form>
//   );
// };

// export default ResearchInstituteForm;

// ResearchInstituteForm.jsx
import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { InputField } from "../Fields/InputField";

const ResearchInstituteForm = ({ email }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    // Map form data to match API payload structure
    const payload = {
      email: data.email || email, // Use form email or fallback to prop email
      role: "user",
      userType: "research_institute",
      additionalDetails: {
        institution_name: data.instituteName,
        institution_code: data.instituteCode,
        contact_number: data.contactNumber,
        email: data.email || email,
        website: data.website,
        country: data.country,
        region: data.region,
        research_focus: data.researchFocus,
      },
    };

    // Axios configuration
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:5000/signup",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(payload),
    };

    // Send data to API
    try {
      const response = await axios.request(config);
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-6 mb-6 md:grid-cols-2">
        <InputField
          label="Institute Name"
          name="instituteName"
          placeholder="Enter institute name"
          register={register}
          validation={{ required: "Institute name is required" }}
          error={errors.instituteName}
        />
        <InputField
          label="Institute Code"
          name="instituteCode"
          placeholder="Enter institute code"
          register={register}
          validation={{ required: "Institute code is required" }}
          error={errors.instituteCode}
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
        <InputField
          label="Website"
          name="website"
          placeholder="Enter website URL"
          register={register}
          validation={{ required: "Website is required" }}
          error={errors.website}
        />
        <InputField
          label="Country"
          name="country"
          placeholder="Enter country"
          register={register}
          validation={{ required: "Country is required" }}
          error={errors.country}
        />
        <InputField
          label="Region"
          name="region"
          placeholder="Enter region"
          register={register}
          validation={{ required: "Region is required" }}
          error={errors.region}
        />
        <InputField
          label="Research Focus"
          name="researchFocus"
          placeholder="Enter research focus"
          register={register}
          validation={{ required: "Research focus is required" }}
          error={errors.researchFocus}
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

export default ResearchInstituteForm;
