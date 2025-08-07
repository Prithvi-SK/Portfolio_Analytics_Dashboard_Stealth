import React, { useState, useEffect } from 'react';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Building2 } from 'lucide-react';
import { getHoldings } from '../services/endpoints';

const Holdings = () => {
  // State for holdings data
  const [holdings, setHoldings] = useState([]);
  const [filteredHoldings, setFilteredHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sorting config: which column and direction
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  // Search term from user input
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch holdings data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getHoldings();
        if (response.error) {
          setError(response.error.message || 'Failed to fetch holdings');
        } else {
          setHoldings(response.data);
          setFilteredHoldings(response.data);
        }
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter holdings when search term changes
  useEffect(() => {
    const filtered = holdings.filter(holding =>
      holding.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      holding.company_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHoldings(filtered);
  }, [searchTerm, holdings]);

  // Sort data based on column clicked
  const sortData = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredHoldings].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });

    setFilteredHoldings(sortedData);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 bg-gray-900 rounded-xl">
        <div className="flex flex-col items-center space-y-4">
          <div className="loading-spinner" style={{ borderTopColor: '#10b981' }}></div>
          <p className="text-lg text-gray-300">Loading holdings data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-96 bg-gray-900 rounded-xl border" style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <Building2 className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-lg text-red-400 mb-2">Error Loading Holdings</p>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  // Table column definitions
  const columns = [
    { key: 'symbol', label: 'Symbol', width: 'w-24' },
    { key: 'company_name', label: 'Company', width: 'w-48' },
    { key: 'quantity', label: 'Qty', width: 'w-20' },
    { key: 'avg_price', label: 'Avg Price', width: 'w-28' },
    { key: 'current_price', label: 'Current Price', width: 'w-32' },
    { key: 'sector', label: 'Sector', width: 'w-32' },
    { key: 'market_cap', label: 'Market Cap', width: 'w-28' },
    { key: 'exchange', label: 'Exchange', width: 'w-24' },
    { key: 'value', label: 'Value', width: 'w-32' },
    { key: 'gain_loss', label: 'Gain/Loss', width: 'w-32' },
    { key: 'gain_loss_percent', label: 'Gain/Loss %', width: 'w-32' }
  ];

  return (
    <div className="glass-effect rounded-xl p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Holdings</h2>
        <p className="text-gray-400">Detailed view of all your investments</p>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by symbol or company name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      {/* Holdings Table */}
      <div className="table-container">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="table-header">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    onClick={() => sortData(column.key)}
                    className={`${column.width} table-cell text-left text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600 transition-colors duration-200 select-none`}
                    style={{ backgroundColor: 'rgba(75, 85, 99, 0.5)' }}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.label}</span>
                      {sortConfig.key === column.key ? (
                        sortConfig.direction === 'ascending' ? (
                          <ArrowUp className="w-4 h-4" />
                        ) : (
                          <ArrowDown className="w-4 h-4" />
                        )
                      ) : (
                        <ArrowUpDown className="w-4 h-4 opacity-50" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredHoldings.map((holding, index) => (
                <tr key={index} className="table-row transition-colors duration-200">
                  <td className="table-cell text-sm font-medium text-blue-400">{holding.symbol}</td>
                  <td className="table-cell text-sm text-gray-300 truncate max-w-48">{holding.company_name}</td>
                  <td className="table-cell text-sm text-gray-300">{holding.quantity}</td>
                  <td className="table-cell text-sm text-gray-300">₹{holding.avg_price.toFixed(2)}</td>
                  <td className="table-cell text-sm text-gray-300">₹{holding.current_price.toFixed(2)}</td>
                  <td className="table-cell text-sm text-gray-300">
                    <span className="px-2 py-1 bg-gray-700 rounded-full text-xs">{holding.sector}</span>
                  </td>
                  <td className="table-cell text-sm text-gray-300">
                    <span className="px-2 py-1 bg-gray-700 rounded-full text-xs">{holding.market_cap}</span>
                  </td>
                  <td className="table-cell text-sm text-gray-300">{holding.exchange}</td>
                  <td className="table-cell text-sm font-medium text-white">₹{holding.value.toFixed(2)}</td>
                  <td className={`table-cell text-sm font-medium ${holding.gain_loss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ₹{holding.gain_loss.toFixed(2)}
                  </td>
                  <td className={`table-cell text-sm font-medium ${holding.gain_loss_percent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {(holding.gain_loss_percent * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* No results found */}
      {filteredHoldings.length === 0 && !loading && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg">No holdings found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default Holdings;
