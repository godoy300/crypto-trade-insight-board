
import React, { useState, useMemo } from 'react';
import { Trade, TradeFilters } from '../types/trade';
import { sampleTradeData } from '../data/sampleTradeData';
import FilterBar from './FilterBar';
import PerformanceMetrics from './PerformanceMetrics';
import TradeResultsChart from './TradeResultsChart';
import ReturnsDistribution from './ReturnsDistribution';
import TradeTable from './TradeTable';

const Dashboard: React.FC = () => {
  const [filters, setFilters] = useState<TradeFilters>({
    tradeType: 'ALL',
    orderType: 'ALL',
    startDate: null,
    endDate: null,
  });

  // Filter trades based on current filters
  const filteredTrades = useMemo(() => {
    return sampleTradeData.filter(trade => {
      // Filter by trade type
      if (filters.tradeType !== 'ALL' && trade.type !== filters.tradeType) {
        return false;
      }
      
      // Filter by order type
      if (filters.orderType !== 'ALL' && trade.orderType !== filters.orderType) {
        return false;
      }
      
      // Filter by date range
      if (filters.startDate && new Date(trade.date) < new Date(filters.startDate)) {
        return false;
      }
      
      if (filters.endDate && new Date(trade.date) > new Date(filters.endDate)) {
        return false;
      }
      
      return true;
    });
  }, [filters]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Crypto Trading Dashboard</h1>
      
      {/* Filters */}
      <FilterBar filters={filters} setFilters={setFilters} />
      
      {/* Performance Metrics */}
      <PerformanceMetrics trades={filteredTrades} />
      
      {/* Charts */}
      <TradeResultsChart trades={filteredTrades} />
      <ReturnsDistribution trades={filteredTrades} />
      
      {/* Trade Table */}
      <TradeTable trades={filteredTrades} />
    </div>
  );
};

export default Dashboard;
