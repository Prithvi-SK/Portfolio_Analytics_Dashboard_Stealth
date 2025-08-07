import React, { useState, useEffect } from 'react';
import { getSummary } from '../services/endpoints';

const Overview = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await getSummary();
        if (response.error) {
          setError(response.error.message || 'Failed to fetch summary data');
        } else {
          setSummary(response.data);
        }
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
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

  return (
    <div className="summary p-4">
      <h2 className="text-2xl font-bold mb-4">Portfolio Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Total Portfolio Value</h3>
          <p className="text-xl">₹{summary.totalValue.toLocaleString('en-IN')}</p>
        </div>
        <div className="card bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Total Invested Amount</h3>
          <p className="text-xl">₹{summary.totalInvested.toLocaleString('en-IN')}</p>
        </div>
        <div className="card bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Total Gain/Loss</h3>
          <p className={`text-xl ${summary.totalGainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ₹{summary.totalGainLoss.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="card bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Total Gain/Loss Percentage</h3>
          <p className={`text-xl ${summary.totalGainLossPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {(summary.totalGainLossPercent * 100).toFixed(2)}%
          </p>
        </div>
        <div className="card bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Number of Holdings</h3>
          <p className="text-xl">{summary.numberOfHoldings}</p>
        </div>
        <div className="card bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Diversification Score</h3>
          <p className="text-xl">{summary.diversificationScore.toFixed(1)}/10</p>
        </div>
        <div className="card bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Risk Level</h3>
          <p className="text-xl">{summary.riskLevel}</p>
        </div>
      </div>
    </div>
  );
};

export default Overview;