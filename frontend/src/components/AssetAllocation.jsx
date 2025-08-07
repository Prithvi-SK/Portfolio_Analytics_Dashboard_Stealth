import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getSectorAllocation, getMarketCapAllocation } from '../services/endpoints';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Function to generate dynamic colors
const generateColors = (length) => {
  const colors = [];
  for (let i = 0; i < length; i++) {
    const hue = (i * 360) / length; // Distribute hues evenly across the color wheel
    colors.push(`hsl(${hue}, 70%, 50%)`);
  }
  return colors;
};

const AssetAllocation = () => {
  const [sectorData, setSectorData] = useState([]);
  const [marketCapData, setMarketCapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sectorResponse = await getSectorAllocation();
        const marketCapResponse = await getMarketCapAllocation();

        if (sectorResponse.error) {
          setError(sectorResponse.error.message || 'Failed to fetch sector allocation');
        } else {
          setSectorData(sectorResponse.data.map(item => ({
            name: item.sector,
            value: item.value,
            percentage: item.percentage
          })));
          console.log('Sector Data:', sectorResponse.data); // Debug log
        }

        if (marketCapResponse.error) {
          setError(marketCapResponse.error.message || 'Failed to fetch market cap allocation');
        } else {
          setMarketCapData(marketCapResponse.data.map(item => ({
            name: item.marketCap,
            value: item.value,
            percentage: item.percentage
          })));
        }
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  // Sector Distribution Chart Data
  const sectorChartData = {
    labels: sectorData.map(item => item.name),
    datasets: [
      {
        data: sectorData.map(item => item.value),
        backgroundColor: generateColors(sectorData.length),
        hoverOffset: 20,
        borderWidth: 1,
      },
    ],
  };

  // Market Cap Distribution Chart Data
  const marketCapChartData = {
    labels: marketCapData.map(item => item.name),
    datasets: [
      {
        data: marketCapData.map(item => item.value),
        backgroundColor: generateColors(marketCapData.length),
        hoverOffset: 20,
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    cutout: '60%', // Creates donut chart effect
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => ({
                text: label,
                fillStyle: data.datasets[0].backgroundColor[i],
                strokeStyle: 'rgba(0,0,0,0.2)',
                lineWidth: 1,
                hidden: !chart.getDataVisibility(i),
                index: i,
              }));
            }
            return [];
          },
          boxWidth: 20,
          padding: 10,
          font: {
            size: 14,
          },
          // Allow wrapping if labels are long
          usePointStyle: true, // Use circular markers instead of boxes for better space
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const index = context.dataIndex;
            const dataset = context.dataset;
            const value = dataset.data[index];
            const percentage = sectorData[index]?.percentage || marketCapData[index]?.percentage || 0;
            return [
              `Value: ₹${value.toLocaleString('en-IN')}`,
              `Percentage: ${(percentage * 100).toFixed(2)}%`,
            ];
          },
        },
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <div className="asset-allocation p-4">
      <h2 className="text-2xl font-bold mb-4">Asset Allocation</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="chart-container bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Sector Distribution</h3>
          <div className="relative" style={{ minHeight: '400px', maxHeight: '600px', overflowY: 'auto' }}>
            <Doughnut data={sectorChartData} options={chartOptions} />
          </div>
        </div>
        <div className="chart-container bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Market Cap Distribution</h3>
          <div className="relative" style={{ minHeight: '400px', maxHeight: '600px', overflowY: 'auto' }}>
            <Doughnut data={marketCapChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetAllocation;