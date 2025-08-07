import React from 'react';
import { BarChart3 } from 'lucide-react';
import Overview from "./Overview";
import AssetAllocation from "./AssetAllocation";
import Holdings from "./Holdings";
import PerformanceComparison from "./PerformanceComparison";
import TopPerformers from "./TopPerformers";

function Portfolio() {
  return (
    <div className="min-h-screen gradient-bg">
      {/* Dashboard Header with title and last updated timestamp */}
      <div className="header">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="p-2 gradient-blue rounded-lg mr-3">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Portfolio Dashboard</h1>
            </div>
            <div className="text-sm text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Main content blocks for different portfolio insights */}
      <div className="container py-8">
        <div className="space-y-8">
          <Overview />
          <AssetAllocation />
          <Holdings />
          <PerformanceComparison />
          <TopPerformers />
        </div>
      </div>

      {/* Footer with branding info */}
      <footer className="footer">
        <div className="container py-6">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 Portfolio Dashboard. Built with modern fintech design principles.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Portfolio;
