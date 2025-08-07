import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Award, AlertTriangle, Shield, Target } from 'lucide-react';
import { getSummary, getTopPerformers } from '../services/endpoints';

const TopPerformers = () => {
  const [topPerformers, setTopPerformers] = useState({ bestPerformer: {}, worstPerformer: {} });
  const [insights, setInsights] = useState({ diversificationScore: 0, riskLevel: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summaryResponse = await getSummary();
        if (summaryResponse.error) {
          throw new Error(summaryResponse.error.message || 'Failed to fetch summary data');
        }
        
        setInsights({
          diversificationScore: summaryResponse.data.diversificationScore,
          riskLevel: summaryResponse.data.riskLevel,
        });

        const topPerformersResponse = await getTopPerformers();
        if (topPerformersResponse.error) {
          throw new Error(topPerformersResponse.error.message || 'Failed to fetch top performers');
        }
        
        setTopPerformers(topPerformersResponse.data);
      } catch (err) {
        setError(err.message);
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
          <div className="loading-spinner" style={{borderTopColor: '#eab308'}}></div>
          <p className="text-lg text-gray-300">Loading performance insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96 bg-gray-900 rounded-xl border" style={{borderColor: 'rgba(239, 68, 68, 0.2)'}}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-lg text-red-400 mb-2">Error Loading Insights</p>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return 'text-green-400 bg-green-100 border-green-500';
      case 'medium': return 'text-yellow-400 bg-yellow-100 border-yellow-500';
      case 'high': return 'text-red-400 bg-red-100 border-red-500';
      default: return 'text-gray-400 bg-gray-100 border-gray-500';
    }
  };

  const getDiversificationColor = (score) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="glass-effect rounded-xl p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Performance Insights</h2>
        <p className="text-gray-400">Key performers and portfolio analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Best Performer */}
        <div className="card group bg-gradient-green" style={{borderColor: 'rgba(16, 185, 129, 0.2)'}}>
          <div className="flex items-center mb-4">
            <div className="p-3 gradient-green rounded-lg mr-4">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-green-400">Best Performer</h3>
              <p className="text-sm text-gray-400">Top gaining stock</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Symbol:</span>
              <span className="text-white font-semibold">
                {topPerformers.bestPerformer.symbol || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Company:</span>
              <span className="text-white font-medium truncate max-w-32">
                {topPerformers.bestPerformer.name || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Gain:</span>
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-green-400 font-bold text-lg">
                  {(topPerformers.bestPerformer.gainPercent * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
          <div className="shimmer-effect"></div>
        </div>

        {/* Worst Performer */}
        <div className="card group bg-gradient-red" style={{borderColor: 'rgba(239, 68, 68, 0.2)'}}>
          <div className="flex items-center mb-4">
            <div className="p-3 gradient-red rounded-lg mr-4">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-red-400">Worst Performer</h3>
              <p className="text-sm text-gray-400">Needs attention</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Symbol:</span>
              <span className="text-white font-semibold">
                {topPerformers.worstPerformer.symbol || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Company:</span>
              <span className="text-white font-medium truncate max-w-32">
                {topPerformers.worstPerformer.name || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Loss:</span>
              <div className="flex items-center">
                <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
                <span className="text-red-400 font-bold text-lg">
                  {(topPerformers.worstPerformer.gainPercent * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
          <div className="shimmer-effect"></div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="chart-container">
        <div className="flex items-center mb-6">
          <div className="p-2 gradient-blue rounded-lg mr-3">
            <Target className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Portfolio Health</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-700 rounded-lg p-4" style={{backgroundColor: 'rgba(55, 65, 81, 0.3)'}}>
            <div className="flex items-center mb-3">
              <Shield className="w-5 h-5 text-blue-400 mr-2" />
              <span className="text-gray-400">Diversification Score</span>
            </div>
            <div className="flex items-end space-x-2">
              <span className={`text-3xl font-bold ${getDiversificationColor(insights.diversificationScore)}`}>
                {insights.diversificationScore.toFixed(1)}
              </span>
              <span className="text-gray-500 text-lg">/10</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Higher score indicates better diversification across sectors and holdings
            </p>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4" style={{backgroundColor: 'rgba(55, 65, 81, 0.3)'}}>
            <div className="flex items-center mb-3">
              <AlertTriangle className="w-5 h-5 text-orange-400 mr-2" />
              <span className="text-gray-400">Risk Level</span>
            </div>
            <div className="mb-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskLevelColor(insights.riskLevel)}`}>
                {insights.riskLevel || 'Unknown'}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Based on portfolio beta, volatility, and market cap distribution
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopPerformers;
