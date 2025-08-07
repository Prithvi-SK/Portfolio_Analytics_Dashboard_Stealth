import React, { useState, useEffect } from 'react';
import { getHoldings } from '../services/endpoints';

const Holdings = () => {
  const [holdings, setHoldings] = useState([]);
  const [filteredHoldings, setFilteredHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');

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

  useEffect(() => {
    let filtered = holdings.filter(holding =>
      holding.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      holding.company_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHoldings(filtered);
  }, [searchTerm, holdings]);

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
    <div className="holdings p-4">
      <h2 className="text-2xl font-bold mb-4">Holdings</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by symbol or company name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full md:w-1/2 lg:w-1/3"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              {['symbol', 'company_name', 'quantity', 'avg_price', 'current_price', 'sector', 'market_cap', 'exchange', 'value', 'gain_loss', 'gain_loss_percent'].map((key) => (
                <th
                  key={key}
                  onClick={() => sortData(key)}
                  className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                >
                  {key.replace('_', ' ')}
                  {sortConfig.key === key && (
                    <span>{sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredHoldings.map((holding, index) => (
              <tr key={index} className="hover:bg-gray-100 transition-colors duration-200">
                <td className="px-4 py-2 border-b border-gray-200">{holding.symbol}</td>
                <td className="px-4 py-2 border-b border-gray-200">{holding.company_name}</td>
                <td className="px-4 py-2 border-b border-gray-200">{holding.quantity}</td>
                <td className="px-4 py-2 border-b border-gray-200">₹{holding.avg_price.toFixed(2)}</td>
                <td className="px-4 py-2 border-b border-gray-200">₹{holding.current_price.toFixed(2)}</td>
                <td className="px-4 py-2 border-b border-gray-200">{holding.sector}</td>
                <td className="px-4 py-2 border-b border-gray-200">{holding.market_cap}</td>
                <td className="px-4 py-2 border-b border-gray-200">{holding.exchange}</td>
                <td className="px-4 py-2 border-b border-gray-200">₹{holding.value.toFixed(2)}</td>
                <td className={`px-4 py-2 border-b border-gray-200 ${holding.gain_loss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ₹{holding.gain_loss.toFixed(2)}
                </td>
                <td className={`px-4 py-2 border-b border-gray-200 ${holding.gain_loss_percent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {(holding.gain_loss_percent * 100).toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Holdings;