import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';
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
    return <div className="flex justify-center items-center h-64"><p className="text-lg">Loading...</p></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-64"><p className="text-lg text-red-500">Error: {error}</p></div>;
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
        borderColor: 'blue',
        fill: false,
      },
      {
        label: 'Nifty 50',
        data: normalizedData.map(item => item.nifty),
        borderColor: 'green',
        fill: false,
      },
      {
        label: 'Gold',
        data: normalizedData.map(item => item.gold),
        borderColor: 'orange',
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'month',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Normalized Value (Starting at 100)',
        },
      },
    },
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          title: (tooltipItems) => {
            const date = tooltipItems[0].label;
            return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          },
          label: (tooltipItem) => {
            return `${tooltipItem.dataset.label}: ${tooltipItem.parsed.y.toFixed(2)}`;
          },
        },
      },
      legend: {
        position: 'top',
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

  const oneMonthReturn = calculateReturn(performanceData, 30);
  const threeMonthReturn = calculateReturn(performanceData, 90);
  const oneYearReturn = calculateReturn(performanceData, 365);

  return (
    <div className="performance-comparison p-4">
      <h2 className="text-2xl font-bold mb-4">Performance Comparison</h2>
      <div className="chart-container bg-white p-4 rounded-lg shadow-md">
        <Line data={chartData} options={chartOptions} />
      </div>
      <div className="metrics mt-4">
        <h3 className="text-xl font-semibold mb-2">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['1 Month', '3 Months', '1 Year'].map((period, index) => {
            const returns = [oneMonthReturn, threeMonthReturn, oneYearReturn][index];
            return (
              <div key={period} className="bg-white p-4 rounded-lg shadow-md">
                <h4 className="text-lg font-semibold">{period}</h4>
                {returns ? (
                  <ul>
                    <li className={returns.portfolioReturn >= 0 ? 'text-green-500' : 'text-red-500'}>
                      Portfolio: {returns.portfolioReturn.toFixed(2)}%
                    </li>
                    <li className={returns.niftyReturn >= 0 ? 'text-green-500' : 'text-red-500'}>
                      Nifty 50: {returns.niftyReturn.toFixed(2)}%
                    </li>
                    <li className={returns.goldReturn >= 0 ? 'text-green-500' : 'text-red-500'}>
                      Gold: {returns.goldReturn.toFixed(2)}%
                    </li>
                  </ul>
                ) : (
                  <p>No data available for this period</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PerformanceComparison;