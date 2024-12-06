import Catch from "../models/FishCatchData.js";

import moment from 'moment'; 

const formatChartData = (data, field) => {
    const labels = data.map(item => item._id);
    const chartData = data.map(item => item.totalCatchWeight);
    return {
      labels,
      datasets: [
        {
          label: `Total Catch Weight by ${field}`,
          data: chartData,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  };


  const parseDate = (dateStr) => {
    const date = moment(dateStr, 'YYYY-MM-DD', true);
    return date.isValid() ? date.toDate() : null;
  };

export let  totalCatchWeightByDate = async(req , res)=>{
    const { from, to } = req.body;

  // Parse the 'from' and 'to' dates
  const fromDate = parseDate(from);
  const toDate = parseDate(to);

  if (!fromDate || !toDate) {
    return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
  }

  try {
    const data = await Catch.aggregate([
      {
        $match: {
          date: { $gte: fromDate, $lte: toDate }, // Filter by date range
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalCatchWeight: { $sum: "$total_weight" },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date
      },
    ]);
    const chartData = formatChartData(data, 'Date');
    res.json(chartData);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching data', error: err });
  }
}



export let  totalCatchWeightBySpecies = async(req , res)=>{
    const { from, to } = req.body;

    // Parse the 'from' and 'to' dates
    const fromDate = parseDate(from);
    const toDate = parseDate(to);
  
    if (!fromDate || !toDate) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
    }
  
    try {
      const data = await Catch.aggregate([
        {
          $match: {
            date: { $gte: fromDate, $lte: toDate }, // Filter by date range
          },
        },
        { $unwind: '$species' },
        {
          $group: {
            _id: '$species.name',
            totalCatchWeight: { $sum: '$species.catch_weight' },
          },
        },
        {
          $sort: { totalCatchWeight: -1 }, // Sort by total catch weight
        },
      ]);
      const chartData = formatChartData(data, 'Species');
      res.json(chartData);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching data', error: err });
    }
}


export let  totalCatchWeightBySea = async(req , res)=>{

 const { from, to } = req.body;

  // Parse the 'from' and 'to' dates
  const fromDate = parseDate(from);
  const toDate = parseDate(to);

  if (!fromDate || !toDate) {
    return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
  }

  try {
    const data = await Catch.aggregate([
      {
        $match: {
          date: { $gte: fromDate, $lte: toDate }, // Filter by date range
        },
      },
      {
        $group: {
          _id: '$sea',
          totalCatchWeight: { $sum: '$total_weight' },
        },
      },
      {
        $sort: { totalCatchWeight: -1 }, // Sort by total catch weight
      },
    ]);
    const chartData = formatChartData(data, 'Sea');
    res.json(chartData);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching data', error: err });
  }
}

export let totalCatchWeightByState = async(req , res)=>{
    const { from, to } = req.body;

  // Parse the 'from' and 'to' dates
  const fromDate = parseDate(from);
  const toDate = parseDate(to);

  if (!fromDate || !toDate) {
    return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
  }

  try {
    const data = await Catch.aggregate([
      {
        $match: {
          date: { $gte: fromDate, $lte: toDate }, // Filter by date range
        },
      },
      {
        $group: {
          _id: '$state',
          totalCatchWeight: { $sum: '$total_weight' },
        },
      },
      {
        $sort: { totalCatchWeight: -1 }, // Sort by total catch weight
      },
    ]);
    const chartData = formatChartData(data, 'State');
    res.json(chartData);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching data', error: err });
  }
}

export let totalCatchWeightByDepth = async(req , res)=>{
    const { from, to } = req.body;

  // Parse the 'from' and 'to' dates
  const fromDate = parseDate(from);
  const toDate = parseDate(to);

  if (!fromDate || !toDate) {
    return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
  }

  try {
    const data = await Catch.aggregate([
      {
        $match: {
          date: { $gte: fromDate, $lte: toDate }, // Filter by date range
        },
      },
      {
        $project: {
          depthCategory: {
            $cond: {
              if: { $lte: ['$depth', 50] },
              then: '0-50 meters',
              else: {
                $cond: {
                  if: { $lte: ['$depth', 100] },
                  then: '50-100 meters',
                  else: '100+ meters',
                },
              },
            },
          },
          total_weight: 1,
        },
      },
      {
        $group: {
          _id: '$depthCategory',
          totalCatchWeight: { $sum: '$total_weight' },
        },
      },
      {
        $sort: { totalCatchWeight: -1 },
      },
    ]);
    const chartData = formatChartData(data, 'Depth');
    res.json(chartData);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching data', error: err });
  }
}
export let totalCatchWeightByDataType = async(req , res)=>{
    const { from, to } = req.body;

  // Parse the 'from' and 'to' dates
  const fromDate = parseDate(from);
  const toDate = parseDate(to);

  if (!fromDate || !toDate) {
    return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
  }

  try {
    const data = await Catch.aggregate([
      {
        $match: {
          date: { $gte: fromDate, $lte: toDate }, // Filter by date range
        },
      },
      {
        $group: {
          _id: '$data_type',
          totalCatchWeight: { $sum: '$total_weight' },
        },
      },
      {
        $sort: { totalCatchWeight: -1 }, // Sort by total catch weight
      },
    ]);
    const chartData = formatChartData(data, 'Data Type');
    res.json(chartData);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching data', error: err });
  }
}
   












// bubble chart 

export const getCatchDataForBubbleChart = async (req, res) => {
    const { from, to } = req.body;
  
    // Parse the 'from' and 'to' dates
    const fromDate = new Date(from);
    const toDate = new Date(to);
  
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
    }
  
    try {
      // Query the catches within the date range
      const data = await Catch.find({
        date: { $gte: fromDate, $lte: toDate },
      });
  
      // Map the data to a format that Chart.js expects for a bubble chart
      const chartData = data.map((item) => ({
        x: item.date,  // X-axis: Date
        y: item.total_weight,  // Y-axis: Total catch weight
        r: item.species.length * 2,  // Radius: Size of the bubble based on the number of species
      }));
  
      // Send the data to the frontend
      res.json({
        datasets: [
          {
            label: 'Catch Data',
            data: chartData,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
      });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching data', error: err });
    }
  };


  export const getCatchWeightVsDepth = async (req, res) => {
    const { from, to } = req.body;
  
    // Parse the 'from' and 'to' dates
    const fromDate = new Date(from);
    const toDate = new Date(to);
  
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
    }
  
    try {
      // Query the catches within the date range
      const data = await Catch.find({
        date: { $gte: fromDate, $lte: toDate },
      });
  
      // Map the data to a format that Chart.js expects for a bubble chart
      const chartData = data.map((item) => ({
        x: item.total_weight,  // X-axis: Total catch weight
        y: item.depth !== null && item.depth !== undefined ? item.depth : 0,  // Y-axis: Depth (fallback to 0 if null)
        r: item.species.length * 2,  // Radius: Number of species
      }));
  
      // Send the data to the frontend
      res.json({
        datasets: [
          {
            label: 'Catch Weight vs Depth',
            data: chartData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching data', error: err });
    }
  };
  
  

  export const getLocationDataForBubbleChart = async (req, res) => {
    const { from, to } = req.body;
  
    // Parse the 'from' and 'to' dates
    const fromDate = new Date(from);
    const toDate = new Date(to);
  
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
    }
  
    try {
      // Query the catches within the date range
      const data = await Catch.find({
        date: { $gte: fromDate, $lte: toDate },
      });
  
      // Map the data to a format that Chart.js expects for a bubble chart
      const chartData = data
      .filter(item => item.depth && item.depth !== 0) // Filter out items with no depth or depth equal to 0
      .map((item) => ({
        x: item.longitude,  // X-axis: Longitude
        y: item.latitude,   // Y-axis: Latitude
        r: item.depth * 2,   // Radius: Depth multiplied by 2
      }));
    
  
      // Send the data to the frontend
      res.json({
        datasets: [
          {
            label: 'Catch Location Data',
            data: chartData,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching data', error: err });
    }
  };
  