import React, { useRef, useEffect } from "react";
import { Card, CardContent, Typography, Grid, List, ListItem, ListItemText } from "@mui/material";
import { Bar, Pie } from "react-chartjs-2";

// Import necessary components from Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ResearchStatsMap = ({ catchData }) => {
  const calculateTotalCatchWeight = () => {
    return catchData.reduce((total, data) => {
      const catchWeight = data.catches.reduce((subTotal, singleCatch) => {
        if (!singleCatch || !singleCatch.species) {
          console.warn("Missing species data in catch:", singleCatch);
          return subTotal; // Skip if species data is missing
        }
        const speciesWeight = singleCatch.species.reduce(
          (speciesTotal, species) => speciesTotal + (species.catch_weight || 0),
          0
        );
        return subTotal + speciesWeight;
      }, 0);
      return total + catchWeight;
    }, 0);
  };

  const calculateAverageDepth = () => {
    const allDepths = catchData.flatMap((data) =>
      data.catches.map((catchDetail) => catchDetail.depth)
    );
    const totalDepth = allDepths.reduce((total, depth) => total + depth, 0);
    return (totalDepth / allDepths.length).toFixed(2);
  };

  const calculateSpeciesCounts = () => {
    const speciesMap = new Map();
    catchData.forEach((data) => {
      if (!data.catches) return; // Skip if no catches data
      data.catches.forEach((catchDetail) => {
        if (!catchDetail.species || catchDetail.species.length === 0) {
          console.warn("Missing or empty species array in catch:", catchDetail);
          return; // Skip if no species data
        }
        catchDetail.species.forEach((s) => {
          if (s.name && s.catch_weight) { // Check if required fields exist
            speciesMap.set(
              s.name,
              (speciesMap.get(s.name) || 0) + s.catch_weight
            );
          }
        });
      });
    });
    return Array.from(speciesMap.entries());
  };

  // Data for charts
  const totalCatchWeight = calculateTotalCatchWeight();
  const averageDepth = calculateAverageDepth();
  const speciesCounts = calculateSpeciesCounts();

  const speciesNames = speciesCounts.map(([species]) => species);
  const speciesWeights = speciesCounts.map(([, weight]) => weight);

  const barData = {
    labels: speciesNames,
    datasets: [
      {
        label: "Species Weight (kg)",
        data: speciesWeights,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: speciesNames,
    datasets: [
      {
        label: "Species Distribution",
        data: speciesWeights,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  // Refs to manage charts
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);

  useEffect(() => {
    // Cleanup chart instances when the component unmounts or data changes
    return () => {
      if (barChartRef.current && barChartRef.current.chartInstance) {
        barChartRef.current.chartInstance.destroy();
      }
      if (pieChartRef.current && pieChartRef.current.chartInstance) {
        pieChartRef.current.chartInstance.destroy();
      }
    };
  }, [catchData]); // Re-run the effect if data changes

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Research Stats
      </Typography>
      <Grid container spacing={3}>
        {/* Total Catch Weight */}
        <Grid item xs={12} sm={6} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Total Catch Weight
              </Typography>
              <Typography variant="h4" color="primary">
                {totalCatchWeight} kg
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Average Depth */}
        <Grid item xs={12} sm={6} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Average Depth
              </Typography>
              <Typography variant="h4" color="primary">
                {averageDepth} meters
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Bar Chart for Species Weight */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Species Weight Distribution
              </Typography>
              <Bar ref={barChartRef} data={barData} />
            </CardContent>
          </Card>
        </Grid>

        {/* Pie Chart for Species Distribution */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Species Distribution
              </Typography>
              <Pie ref={pieChartRef} data={pieData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default ResearchStatsMap;
