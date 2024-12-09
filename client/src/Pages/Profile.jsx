import React from 'react';
// import Breadcrumb from '../Components/Breadcrumbs/Breadcrumb';
const Profile = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Settings</h1>
          <nav>
            <ol className="flex items-center text-sm">
              <li>
                <a className="text-blue-500" href="/dashboard">Dashboard</a> /
              </li>
              <li className="ml-2 text-gray-500">Settings</li>
            </ol>
          </nav>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Personal Information Section */}
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          defaultValue="David Jhon"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
        <input
          type="text"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          defaultValue="+990 3343 7865"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email Address</label>
        <input
          type="email"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          defaultValue="devidjond45@gmail.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          defaultValue="devidjhon24"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">BIO</label>
        <textarea
          rows="4"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna, eu condimentum mauris tempus ut. Donec fermentum blandit aliquet."
        />
      </div>
    </div>
    <div className="mt-4 flex justify-between">
      <button className="px-4 py-2 bg-gray-300 rounded-md text-sm font-medium">Cancel</button>
      <button className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium">Save</button>
    </div>
  </div>

  {/* Your Photo Section */}
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-4">Your Photo</h2>
    <div className="text-blue-500 cursor-pointer mb-2">Edit your photo</div>
      <img
        src="https://via.placeholder.com/100"
        alt="Profile"
        className="w-24 h-24 rounded-full mb-4"
      />
      <button className="text-red-500 text-sm">Delete</button>
      <button className="text-red=500 text-sm">Update</button>
      <div className="flex flex-col items-center border border-dashed border-gray-300 rounded-md p-4">
      <div className="mt-4">
        <label
          className="block text-center py-2 px-4 cursor-pointer"
          htmlFor="fileUpload"
        >
          Click to upload or drag and drop
        </label>
        <p className="text-sm text-gray-500 mt-2">SVG, PNG, JPG, or GIF (max, 800 x 800px)</p>
        <input id="fileUpload" type="file" className="hidden" />
      </div>
    </div>
    <div className="mt-4 flex justify-between">
      <button className="px-4 py-2 bg-gray-300 rounded-md text-sm font-medium">Cancel</button>
      <button className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium">Save</button>
    </div>
  </div>
</div>
      </div>
    </div>
  );
};

export default Profile;
