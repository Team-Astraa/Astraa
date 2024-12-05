import React from 'react';
import { Scatter } from 'react-chartjs-2';

const ScatterChart = () => {
  const data = {
    datasets: [
      {
        label: 'Scatter Dataset',
        data: [
          { x: 10, y: 20 },
          { x: 15, y: 25 },
          { x: 20, y: 30 },
        ],
        backgroundColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  return <Scatter data={data} />;
};

export default ScatterChart;
