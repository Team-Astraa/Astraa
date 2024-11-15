// InputField.jsx
import React from "react";

const InputField = ({
  label,
  name,
  type = "text",
  placeholder,
  register,
  validation,
  error,
}) => {
  return (
    <div>
      <label
        htmlFor={name}
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        {...register(name, validation)}
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default InputField;
