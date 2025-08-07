import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Shield, BarChart3 } from 'lucide-react';
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
      <div className="flex justify-center items-center h-64 bg-gray-900 rounded-xl">
        <div className="flex flex-col items-center space-y-4">
          <div className="loading-spinner"></div>
          <p className="text-lg text-gray-300">Loading portfolio summary...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-900 rounded-xl border border-red-500" style={{borderColor: 'rgba(239, 68, 68, 0.2)'}}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <TrendingDown className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-lg text-red-400 mb-2">Error Loading Data</p>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Portfolio Value',
      value: `₹${summary.totalValue.toLocaleString('en-IN')}`,
      icon: DollarSign,
      gradient: 'gradient-blue',
      bgGradient: 'bg-gradient-blue'
    },
    {
      title: 'Total Invested Amount',
      value: `₹${summary.totalInvested.toLocaleString('en-IN')}`,
      icon: PieChart,
      gradient: 'gradient-purple',
      bgGradient: 'bg-gradient-purple'
    },
    {
      title: 'Total Gain/Loss',
      value: `₹${summary.totalGainLoss.toLocaleString('en-IN')}`,
      icon: summary.totalGainLoss >= 0 ? TrendingUp : TrendingDown,
      gradient: summary.totalGainLoss >= 0 ? 'gradient-green' : 'gradient-red',
      bgGradient: summary.totalGainLoss >= 0 ? 'bg-gradient-green' : 'bg-gradient-red',
      textColor: summary.totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'
    },
    {
      title: 'Gain/Loss Percentage',
      value: `${(summary.totalGainLossPercent * 100).toFixed(2)}%`,
      icon: summary.totalGainLossPercent >= 0 ? TrendingUp : TrendingDown,
      gradient: summary.totalGainLossPercent >= 0 ? 'gradient-green' : 'gradient-red',
      bgGradient: summary.totalGainLossPercent >= 0 ? 'bg-gradient-green' : 'bg-gradient-red',
      textColor: summary.totalGainLossPercent >= 0 ? 'text-green-400' : 'text-red-400'
    },
    {
      title: 'Number of Holdings',
      value: summary.numberOfHoldings,
      icon: BarChart3,
      gradient: 'gradient-indigo',
      bgGradient: 'bg-gradient-indigo'
    },
    {
      title: 'Diversification Score',
      value: `${summary.diversificationScore.toFixed(1)}/10`,
      icon: Shield,
      gradient: 'gradient-teal',
      bgGradient: 'bg-gradient-teal'
    },
    {
      title: 'Risk Level',
      value: summary.riskLevel,
      icon: Shield,
      gradient: 'gradient-orange',
      bgGradient: 'bg-gradient-orange'
    }
  ];

  return (
    <div className="glass-effect rounded-xl p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Portfolio Overview</h2>
        <p className="text-gray-400">Your investment portfolio at a glance</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`card group ${card.bgGradient}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.gradient} shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2 leading-tight">
                  {card.title}
                </h3>
                <p className={`text-2xl font-bold ${card.textColor || 'text-white'} tracking-tight tabular-nums`}>
                  {card.value}
                </p>
              </div>
              
              <div className="shimmer-effect"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Overview;
