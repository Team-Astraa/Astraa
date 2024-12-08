import React, { useState, useEffect } from "react";

const ScientistCharts = () => {
  const [iframeSrc, setIframeSrc] = useState(
    "https://charts.mongodb.com/charts-sneha-lqltzmn/public/dashboards/ccf47374-f531-4d96-8188-99168ef9197e"
  );
  const [status, setStatus] = useState("Checking for updates...");

  const refreshDashboard = () => {
    setStatus("Refreshing dashboard...");
    setIframeSrc("");
    setTimeout(() => {
      setIframeSrc(
        "https://charts.mongodb.com/charts-sneha-lqltzmn/public/dashboards/ccf47374-f531-4d96-8188-99168ef9197e"
      );
      setStatus("Dashboard updated!");
    }, 1000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      refreshDashboard();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 text-white text-center py-4">
        <h1 className="text-3xl font-bold">MongoDB Dashboard</h1>
        <p className="text-sm">{status}</p>
      </header>

      {/* Fullscreen Dashboard */}
      <div className="flex-grow">
        <iframe
          title="MongoDB Dashboard"
          src={iframeSrc}
          className="w-full h-full border-none"
        />
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-2">
        <button
          onClick={refreshDashboard}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium shadow-md"
        >
          Refresh Dashboard
        </button>
      </footer>
    </div>
  );
};

export default ScientistCharts;
