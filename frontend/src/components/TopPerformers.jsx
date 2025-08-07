import React, { useState, useEffect } from 'react';
import { getSummary, getTopPerformers } from '../services/endpoints';

const TopPerformers = () => {
  const [topPerformers, setTopPerformers] = useState({ bestPerformer: {}, worstPerformer: {} });
  const [insights, setInsights] = useState({ diversificationScore: 0, riskLevel: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching summary data...');
        const summaryResponse = await getSummary();
        console.log('Summary response:', summaryResponse);

        if (summaryResponse.error) {
          throw new Error(summaryResponse.error.message || 'Failed to fetch summary data');
        }
        setInsights({
          diversificationScore: summaryResponse.data.diversificationScore,
          riskLevel: summaryResponse.data.riskLevel,
        });

        console.log('Fetching top performers data...');
        const topPerformersResponse = await getTopPerformers();
        console.log('Top performers response:', topPerformersResponse);

        if (topPerformersResponse.error) {
          throw new Error(topPerformersResponse.error.message || 'Failed to fetch top performers');
        }
        setTopPerformers(topPerformersResponse.data);
      } catch (err) {
        console.error('Error in fetchData:', err.message);
        setError(err.message);
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

  return (
    <div className="top-performers p-4">
      <h2 className="text-2xl font-bold mb-4">Top Performers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Best Performer Card */}
        <div
          className="bg-green-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          title={`Gain: ${(topPerformers.bestPerformer.gainPercent * 100).toFixed(2)}%`}
        >
          <h3 className="text-xl font-semibold text-green-700">Best Performer</h3>
          <p className="text-lg">Symbol: {topPerformers.bestPerformer.symbol || 'N/A'}</p>
          <p className="text-lg">Name: {topPerformers.bestPerformer.name || 'N/A'}</p>
          <p className="text-lg">Gain: {(topPerformers.bestPerformer.gainPercent * 100).toFixed(2)}%</p>
        </div>

        {/* Worst Performer Card */}
        <div
          className="bg-red-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          title={`Loss: ${(topPerformers.worstPerformer.gainPercent * 100).toFixed(2)}%`}
        >
          <h3 className="text-xl font-semibold text-red-700">Worst Performer</h3>
          <p className="text-lg">Symbol: {topPerformers.worstPerformer.symbol || 'N/A'}</p>
          <p className="text-lg">Name: {topPerformers.worstPerformer.name || 'N/A'}</p>
          <p className="text-lg">Loss: {(topPerformers.worstPerformer.gainPercent * 100).toFixed(2)}%</p>
        </div>
      </div>

      {/* Key Insights */}
      <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-lg">Diversification Score: {insights.diversificationScore}/10</p>
            <p className="text-sm text-gray-600">
              (Higher score indicates better diversification across sectors and holdings)
            </p>
          </div>
          <div>
            <p className="text-lg">Risk Level: {insights.riskLevel}</p>
            <p className="text-sm text-gray-600">
              (Based on portfolio beta, volatility, and market cap distribution)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopPerformers;