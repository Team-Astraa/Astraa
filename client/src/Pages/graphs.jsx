import React, { useState, useEffect } from 'react';
import BarChart from '../graphs/BarChart';
import BubbleChart from '../graphs/BubbleChart';
import DoughnutChart from '../graphs/DoughnutChart';
import LineChart from '../graphs/LineChart';
import MixedChart from '../graphs/MixedChart';
import PieChart from '../graphs/PieChart';
import ScatterChart from '../graphs/ScatterChart';
import { Button, Modal } from "flowbite-react";

const ChartComponent = () => {
  const [openModalBar, setOpenModalBar] = useState(false);
  const [openModalBub, setOpenModalBub] = useState(false);
  // Get dates from localStorage or set default values
  const storedFromDate = localStorage.getItem('fromDate') || '2024-01-01';
  const storedToDate = localStorage.getItem('toDate') || '2024-12-31';

  const [fromDate, setFromDate] = useState(storedFromDate);
  const [toDate, setToDate] = useState(storedToDate);
  const [selectedOption, setSelectedOption] = useState('default');
  const [selectedOptionBub, setSelectedOptionBub] = useState('default');

  const options = [
    { label: 'Catch Weight by Date', value: 'by-date' },
    { label: 'Catch Weight by Species', value: 'by-species' },
    { label: 'Catch Weight by Sea', value: 'by-sea' },
    { label: 'Catch Weight by State', value: 'by-state' },
    { label: 'Catch Weight by Depth', value: 'by-depth' },
    { label: 'Catch Weight by Data Type', value: 'by-data-type' }
  ];
  const optionsbubble = [
    { label: 'getCatchDataForBubbleChart', value: 'getCatchDataForBubbleChart' },
    { label: 'getCatchWeightVsDepth', value: 'getCatchWeightVsDepth' },
    { label: 'getLocationDataForBubbleChart', value: 'getLocationDataForBubbleChart' }
  ];

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    if (name === 'from') {
      setFromDate(value);
      localStorage.setItem('fromDate', value);  // Store 'fromDate' in localStorage
    }
    if (name === 'to') {
      setToDate(value);
      localStorage.setItem('toDate', value);  // Store 'toDate' in localStorage
    }
  };

  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
    setOpenModalBar(false)
  };
  const handleDropdownChangebub = (event) => {
    setSelectedOptionBub(event.target.value);
    setOpenModalBub(false)
  };

  return (
    <div>
      {/* Navigation Section */}
      <nav className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <div className="text-white text-xl mb-4">Graphs</div>
        <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4">
          {/* From Date */}
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <label className="text-white">From Date:</label>
            <input
              type="date"
              name="from"
              value={fromDate}
              onChange={handleDateChange}
              className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* To Date */}
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <label className="text-white">To Date:</label>
            <input
              type="date"
              name="to"
              value={toDate}
              onChange={handleDateChange}
              className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        </div>
      </nav>
    
       
      <Modal show={openModalBar} onClose={() => setOpenModalBar(false)}>
  {/* Modal background */}
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    {/* Modal content */}
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
      {/* Modal Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Select Data Type</h2>
        <button 
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={() => setOpenModalBar(false)}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>

      {/* Modal Body */}
      <div className="space-y-4">
        {/* Dropdown for selecting the data type */}
        <div className="flex items-center space-x-2">
          <label htmlFor="dataType" className="text-gray-700">Data Type:</label>
          <select
            id="dataType"
            onChange={handleDropdownChange}
            value={selectedOption}
            className="px-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="default">Select Data Type</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Modal Footer */}
      <div className="flex justify-end space-x-4">
        <button 
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setOpenModalBar(false)}
        >
          Close
        </button>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Apply
        </button>
      </div>
    </div>
  </div>
</Modal>


{/* //bubb model  */}
<Modal show={openModalBub} onClose={() => setOpenModalBub(false)}>
  {/* Modal background */}
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    {/* Modal content */}
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
      {/* Modal Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Select Data Type</h2>
        <button 
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={() => setOpenModalBub(false)}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>

      {/* Modal Body */}
      <div className="space-y-4">
        {/* Dropdown for selecting the data type */}
        <div className="flex items-center space-x-2">
          <label htmlFor="dataType" className="text-gray-700">Data Type:</label>
          <select
            id="dataType"
            onChange={handleDropdownChangebub}
            value={selectedOptionBub}
            className="px-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="default">Select Data Type</option>
            {optionsbubble.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Modal Footer */}
      <div className="flex justify-end space-x-4">
        <button 
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setOpenModalBub(false)}
        >
          Close
        </button>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Apply
        </button>
      </div>
    </div>
  </div>
</Modal>


      

      {/* Chart Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {/* Bar Chart */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-md relative">
          <h3 className="text-white text-center text-lg mb-4">Bar Chart</h3>
        
          <BarChart toDate={toDate} fromDate={fromDate} selectedOption={selectedOption} />
          <i onClick={() => setOpenModalBar(true)} className="fa-solid fa-filter text-2xl cursor-pointer text-white absolute right-3 top-3 hover:text-3xl transition-all duration-150"></i>
        </div>

        {/* Bubble Chart */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-md relative">
          <h3 className="text-white text-center text-lg mb-4">Bubble Chart</h3>
          <BubbleChart toDate={toDate} fromDate={fromDate} selectedOptionBub={selectedOptionBub} />
          <i onClick={() => setOpenModalBub(true)} className="fa-solid fa-filter text-2xl cursor-pointer text-white absolute right-3 top-3 hover:text-3xl transition-all duration-150"></i>
        </div>

        {/* Doughnut Chart */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-white text-center text-lg mb-4">Doughnut Chart</h3>
          <DoughnutChart />
        </div>

        {/* Line Chart */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-white text-center text-lg mb-4">Line Chart</h3>
          <LineChart />
        </div>

        {/* Mixed Chart */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-white text-center text-lg mb-4">Mixed Chart</h3>
          <MixedChart />
        </div>

        {/* Pie Chart */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-white text-center text-lg mb-4">Pie Chart</h3>
          <PieChart />
        </div>

        {/* Scatter Chart */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-white text-center text-lg mb-4">Scatter Chart</h3>
          <ScatterChart />
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;
