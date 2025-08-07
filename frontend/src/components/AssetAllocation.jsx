import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { PieChart, TrendingUp } from 'lucide-react';
import { getSectorAllocation, getMarketCapAllocation } from '../services/endpoints';

// Register chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

// Generates a palette of colors for chart segments
const generateColors = (length) => {
  const colors = [
    '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ];
  const result = [];
  for (let i = 0; i < length; i++) {
    result.push(colors[i % colors.length]);
  }
  return result;
};

const AssetAllocation = () => {
  const [sectorData, setSectorData] = useState([]);
  const [marketCapData, setMarketCapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch sector and market cap allocation data
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

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 bg-gray-900 rounded-xl">
        <div className="flex flex-col items-center space-y-4">
          <div className="loading-spinner" style={{borderTopColor: '#8b5cf6'}}></div>
          <p className="text-lg text-gray-300">Loading asset allocation...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-96 bg-gray-900 rounded-xl border" style={{borderColor: 'rgba(239, 68, 68, 0.2)'}}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <PieChart className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-lg text-red-400 mb-2">Error Loading Charts</p>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  // Converts raw data to Chart.js format
  const createChartData = (data) => ({
    labels: data.map(item => item.name),
    datasets: [{
      data: data.map(item => item.value),
      backgroundColor: generateColors(data.length),
      borderColor: '#1F2937',
      borderWidth: 2,
      hoverOffset: 8,
    }]
  });

  // Chart configuration
  const chartOptions = {
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#D1D5DB',
          padding: 20,
          font: { size: 12 },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#F9FAFB',
        bodyColor: '#D1D5DB',
        borderColor: '#374151',
        borderWidth: 1,
        callbacks: {
          // Custom tooltip with value and percentage
          label: function (context) {
            const index = context.dataIndex;
            const dataset = context.dataset;
            const value = dataset.data[index];
            const data = context.chart.data.labels[index] === sectorData[index]?.name ? sectorData : marketCapData;
            const percentage = data[index]?.percentage || 0;
            return [
              `Value: ₹${value.toLocaleString('en-IN')}`,
              `Percentage: ${(percentage * 100).toFixed(2)}%`
            ];
          }
        }
      }
    },
    maintainAspectRatio: false,
    responsive: true
  };

  return (
    <div className="glass-effect rounded-xl p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Asset Allocation</h2>
        <p className="text-gray-400">Distribution of your investments across sectors and market caps</p>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Sector Allocation Chart */}
        <div className="chart-container">
          <div className="flex items-center mb-6">
            <div className="p-2 gradient-blue rounded-lg mr-3">
              <PieChart className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Sector Distribution</h3>
          </div>
          <div className="relative h-80">
            <Doughnut data={createChartData(sectorData)} options={chartOptions} />
          </div>
        </div>
        
        {/* Market Cap Allocation Chart */}
        <div className="chart-container">
          <div className="flex items-center mb-6">
            <div className="p-2 gradient-purple rounded-lg mr-3">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Market Cap Distribution</h3>
          </div>
          <div className="relative h-80">
            <Doughnut data={createChartData(marketCapData)} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetAllocation;
