import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { TrendingUp, Activity } from 'lucide-react';
import { getHistoricalPerformance } from '../services/endpoints';

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend);

const PerformanceComparison = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getHistoricalPerformance();
        if (response.error) {
          setError(response.error.message || 'Failed to fetch historical performance');
        } else {
          const sortedData = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
          setPerformanceData(sortedData);
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
      <div className="flex justify-center items-center h-96 bg-gray-900 rounded-xl">
        <div className="flex flex-col items-center space-y-4">
          <div className="loading-spinner" style={{borderTopColor: '#f59e0b'}}></div>
          <p className="text-lg text-gray-300">Loading performance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96 bg-gray-900 rounded-xl border" style={{borderColor: 'rgba(239, 68, 68, 0.2)'}}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <Activity className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-lg text-red-400 mb-2">Error Loading Performance</p>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  const normalizedData = performanceData.map(item => ({
    date: new Date(item.date),
    portfolio: (1 + item.portfolio_return) * 100,
    nifty: (1 + item.nifty_50_return) * 100,
    gold: (1 + item.gold_return) * 100,
  }));

  const chartData = {
    labels: normalizedData.map(item => item.date),
    datasets: [
      {
        label: 'Portfolio',
        data: normalizedData.map(item => item.portfolio),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        borderWidth: 3,
      },
      {
        label: 'Nifty 50',
        data: normalizedData.map(item => item.nifty),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        borderWidth: 2,
      },
      {
        label: 'Gold',
        data: normalizedData.map(item => item.gold),
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'month',
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
        ticks: {
          color: '#9CA3AF',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Normalized Value (Starting at 100)',
          color: '#D1D5DB',
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
        ticks: {
          color: '#9CA3AF',
        },
      },
    },
    plugins: {
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#F9FAFB',
        bodyColor: '#D1D5DB',
        borderColor: '#374151',
        borderWidth: 1,
        callbacks: {
          title: (tooltipItems) => {
            const date = tooltipItems[0].label;
            return new Date(date).toLocaleDateString('en-US', { 
              month: 'short', 
              year: 'numeric' 
            });
          },
          label: (tooltipItem) => {
            return `${tooltipItem.dataset.label}: ${tooltipItem.parsed.y.toFixed(2)}`;
          },
        },
      },
      legend: {
        position: 'top',
        labels: {
          color: '#D1D5DB',
          usePointStyle: true,
          padding: 20,
        },
      },
    },
  };

  const calculateReturn = (data, days) => {
    if (data.length < 2) return null;
    const latest = data[data.length - 1];
    const pastDate = new Date(latest.date);
    pastDate.setDate(pastDate.getDate() - days);
    
    const pastData = data.reduce((prev, curr) => {
      const prevDiff = Math.abs(new Date(prev.date) - pastDate);
      const currDiff = Math.abs(new Date(curr.date) - pastDate);
      return currDiff < prevDiff ? curr : prev;
    });

    const portfolioReturn = ((1 + latest.portfolio_return) / (1 + pastData.portfolio_return) - 1) * 100;
    const niftyReturn = ((1 + latest.nifty_50_return) / (1 + pastData.nifty_50_return) - 1) * 100;
    const goldReturn = ((1 + latest.gold_return) / (1 + pastData.gold_return) - 1) * 100;

    return { portfolioReturn, niftyReturn, goldReturn };
  };

  const periods = [
    { label: '1 Month', days: 30, returns: calculateReturn(performanceData, 30) },
    { label: '3 Months', days: 90, returns: calculateReturn(performanceData, 90) },
    { label: '1 Year', days: 365, returns: calculateReturn(performanceData, 365) }
  ];

  return (
    <div className="glass-effect rounded-xl p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Performance Comparison</h2>
        <p className="text-gray-400">Compare your portfolio performance against market benchmarks</p>
      </div>

      <div className="chart-container mb-8">
        <div className="flex items-center mb-6">
          <div className="p-2 gradient-blue rounded-lg mr-3">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Historical Performance</h3>
        </div>
        <div className="h-80">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {periods.map((period) => (
          <div
            key={period.label}
            className="chart-container"
          >
            <h4 className="text-lg font-semibold text-white mb-4">{period.label} Returns</h4>
            {period.returns ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Portfolio:</span>
                  <span className={`font-semibold ${
                    period.returns.portfolioReturn >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {period.returns.portfolioReturn.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Nifty 50:</span>
                  <span className={`font-semibold ${
                    period.returns.niftyReturn >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {period.returns.niftyReturn.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Gold:</span>
                  <span className={`font-semibold ${
                    period.returns.goldReturn >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {period.returns.goldReturn.toFixed(2)}%
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No data available for this period</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceComparison;
