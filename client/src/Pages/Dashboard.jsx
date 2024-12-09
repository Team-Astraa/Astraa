import { useState, useEffect } from 'react';
import React from 'react';
import CustomCalendar from '../Components/CustomCalendar';
import Table from '../Components/Table';
import { Card, CardContent, Typography } from '@mui/material';
import { Bar, Line, Pie } from 'react-chartjs-2';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
  } from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
  );

const Dashboard = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        getData()
      }, [])
    
    const getData = async () => {
    try {
        const response = await axios.post('http://localhost:5000/scientist/filter-data');
        setData(response.data);

    } catch (error) {
        console.error('Error fetching filtered data:', error);
    }
    }

    const calculateSpeciesStats = () => {
        const speciesMap = new Map();
        data.forEach((catchDetail) => {
            catchDetail.species.forEach((s) => {
              if (s.name && s.catch_weight) {
                speciesMap.set(
                  s.name,
                  (speciesMap.get(s.name) || 0) + s.catch_weight
                );
              }
          });
        });
        const speciesCounts = Array.from(speciesMap.entries());
    
        const mostCommonSpecies = speciesCounts.length
          ? speciesCounts.reduce((mostCommon, current) =>
              current[1] > mostCommon[1] ? current : mostCommon
            )
          : ["No species", 0];
    
        const averageWeight =
          speciesCounts.length > 0
            ? speciesCounts.reduce((sum, [, weight]) => sum + weight, 0) /
              speciesCounts.length
            : 0;
    
        return { speciesCounts, mostCommonSpecies, averageWeight };
      };
    
      const { speciesCounts, mostCommonSpecies, averageWeight } = calculateSpeciesStats();
    
      const speciesNames = speciesCounts.map(([species]) => species);
      const speciesWeights = speciesCounts.map(([, weight]) => weight);
    
      const barData = {
        labels: speciesNames,
        datasets: [
          {
            label: "Species Distribution",
            data: speciesWeights,
            backgroundColor: "#8b5cf6",
            borderColor: "#8b5cf6",
            borderWidth: 1,
          },
        ],
      };

      const lineData = {
        labels: speciesNames,
        datasets: [
          {
            label: "Catch Weight vs Species",
            data: speciesWeights,
            borderColor: "#8b5cf6",
            backgroundColor: "#8b5cf6",
            fill: true,
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
                "#a78bfa", // Lighter variant
                "#6d37d7", // Darker variant
                "#7c3aed", // More saturated variant
                "#9e8bfa", // Muted variant
                "#8b72f6", // Hue-shifted variant
                "#b692fc", // Softer, pastel-like variant
                "#8057e5", // Slightly muted, darker tone
                "#9674f8", // Slightly warmer tone
                "#7b4bf4", // Rich, deep purple
                "#9a7df7", // Balanced purple tone
                "#d8b4fe", // Much lighter, pastel purple
                "#ebe4ff", // Very pale, almost white purple
                "#5a27b4", // Much darker, deep violet
                "#471f8c", // Very dark, rich purple
                "#c4a5fd", // Subtle, lighter lavender
                "#320d6d", // Extremely dark purple
                "#f3e8ff", // Extremely light lavender
                "#220852", // Deep and moody purple
                "#ccb8ff", // Light, delicate purple
                "#19073d", // Ultra-dark violet
            ],
          },
        ],
      };
      return (
          <div className="w-full h-full p-5 bg-white rounded-2xl flex flex-col gap-4">
            {/* Header */}
            <header className="w-full">
              <Typography variant="h4" gutterBottom>
                User Dashboard
              </Typography>
            </header>
      
            {/* Dashboard Sections */}
            <div className="w-full h-full flex flex-wrap gap-4">
              {/* First and Second Sections Side-by-Side */}
              <div className="flex w-full gap-4">
                {/* Section 1: Species Details (4 Cards) */}
                <div className="w-1/2 h-auto grid grid-cols-2 grid-rows-2 gap-4">
                  <div className="h-full bg-red-500 rounded-xl p-3 border border-purple-500 justify-center items-center text-center">
                    <h2 className="text-center text-white text-2xl font-bold">
                      Total Unique Species
                    </h2>
                  </div>
                  <div className="h-full bg-yellow-400 rounded-xl p-3 border border-purple-500 justify-center items-center text-center">
                    <h2 className="text-center text-white text-2xl font-bold">
                      Most Found Species 
                    </h2>
                  </div>
                  <div className="h-full bg-purple-300 rounded-xl p-3 border border-purple-500 justify-center items-center text-center">
                    <h2 className="text-center text-white text-2xl font-bold">
                      Other 1
                    </h2>
                  </div>
                  <div className="h-full bg-purple-200 rounded-xl p-3 border border-purple-500 justify-center items-center text-center">
                    <h2 className="text-center text-white text-2xl font-bold">
                      Other 2
                    </h2>
                  </div>
                </div>
      
                {/* Section 2: Map Component */}
                <div className="w-1/2 h-auto rounded-xl p-3 border border-purple-500">
                  <Typography variant="h6" color="textPrimary">
                    Map Component
                  </Typography>
                </div>
              </div>
      
              {/* Third and Fourth Sections Below */}
              <div className="flex w-full gap-4">
                {/* Section 3: Linear Graph */}
                <div className="w-4/5 rounded-xl p-3 border border-purple-500">
                  <Typography variant="h6" color="textSecondary">
                    Linear Graph
                  </Typography>
                </div>
      
                {/* Section 4: Filter Options */}
                <div className="w-1/5 rounded-xl p-3 border border-purple-500">
                  <Typography variant="h6" color="textSecondary">
                    Filter Options
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        );
      };
      
      export default Dashboard;
      
      