import React from 'react';
import CustomCalendar from '../Components/CustomCalendar';
import Table from '../Components/Table';

const Dashboard = () => {
    return (
        <div className="flex-1 p-5 bg-[#F4F7FC] rounded-2xl h-full">
            <div className="flex gap-8 justify-between">
                {/* Left Section */}
                <div className="w-[70%]">
                    {/* Dashboard Header */}
                    <header className="flex gap-8 items-center mb-5">
                        <h1 className="text-xl font-semibold">Dashboard</h1>
                        <input
                            type="text"
                            placeholder="Search"
                            className="py-2 px-4 rounded-full border-0 shadow-sm w-1/2"
                        />
                    </header>

                    {/* Greeting Section */}
                    <section className="bg-[#0f123f] text-white px-6 py-8 rounded-xl mb-5">
                        <div>
                            <h2 className="text-lg font-light">Good Morning, Farhaan</h2>
                            <p className="text-3xl font-semibold">Check your daily tasks & schedules</p>
                        </div>
                    </section>

                    {/* Activities Section */}
                    <section className="mb-5 p-6 bg-white rounded-xl shadow-md h-[18rem]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-lg">Activities</h3>
                            <div className="flex gap-2">
                                <button className="py-1 px-3 rounded-md bg-blue-800 text-white">
                                    This Month
                                </button>
                                <button className="py-1 px-3 rounded-md bg-blue-800 text-white">
                                    This Week
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-center text-blue-800">
                            Graph will go here
                        </div>
                    </section>

                    {/* Today's Tasks Section */}
                    <section className="mb-5">
                        <h3 className="font-semibold ml-6">Today's Tasks</h3>
                        <Table />
                    </section>
                </div>

                {/* Right Section */}
                <div className="w-[30%]">
                    <CustomCalendar />

                    {/* Statistics Section */}
                    <section className="mt-8 flex flex-col gap-5">
                        <div className="flex-1 p-5 bg-white rounded-xl text-center text-lg text-blue-900 shadow-md">
                            Open Projects <strong>500</strong>
                        </div>
                        <div className="flex-1 p-5 bg-white rounded-xl text-center text-lg text-blue-900 shadow-md">
                            Successfully Completed <strong>3502</strong>
                        </div>
                        <div className="flex-1 p-5 bg-white rounded-xl text-center text-lg text-blue-900 shadow-md">
                            Earned this month <strong>$15000</strong>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
