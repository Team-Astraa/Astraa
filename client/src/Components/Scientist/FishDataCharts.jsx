import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const FishSpeciesCharts = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No data available to display charts.</p>;
  }

  // Extract species data
  const species = data[0]?.species || {};
  const labels = Object.keys(species);
  const values = Object.values(species);

  // Bar chart configuration
  const barChartData = {
    labels,
    datasets: [
      {
        label: "Species Quantities (kg)",
        data: values,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Pie chart configuration
  const pieChartData = {
    labels,
    datasets: [
      {
        label: "Species Distribution",
        data: values,
        backgroundColor: labels.map(
          (_, i) => `hsl(${(i / labels.length) * 360}, 70%, 70%)`
        ),
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="charts">
      <h1>Fish Species Data Visualization</h1>
      <div style={{ width: "600px", margin: "0 auto" }}>
        <h2>Bar Chart</h2>
        <Bar
          data={barChartData}
          options={{
            responsive: true,
            plugins: {
              tooltip: { callbacks: { label: (context) => `${context.raw} kg` } },
            },
          }}
        />
      </div>
      <div style={{ width: "600px", margin: "0 auto", marginTop: "20px" }}>
        <h2>Pie Chart</h2>
        <Pie
          data={pieChartData}
          options={{
            responsive: true,
            plugins: {
              tooltip: { callbacks: { label: (context) => `${context.raw} kg` } },
            },
          }}
        />
      </div>
    </div>
  );
};

export default FishSpeciesCharts;
