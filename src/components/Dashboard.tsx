
import React, { useState, useMemo } from 'react';
import { Trade, TradeFilters } from '../types/trade';
import { sampleTradeData } from '../data/sampleTradeData';
import FilterBar from './FilterBar';
import PerformanceMetrics from './PerformanceMetrics';
import TradeResultsChart from './TradeResultsChart';
import ReturnsDistribution from './ReturnsDistribution';
import TradeTable from './TradeTable';
import TradeCalculator from './TradeCalculator';
import GoalsTracker from './GoalsTracker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart2, Calculator, PieChart, Table, Target } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [filters, setFilters] = useState<TradeFilters>({
    tradeType: 'ALL',
    orderType: 'ALL',
    startDate: null,
    endDate: null,
    broker: 'ALL',
    setup: 'ALL',
  });

  // Add setup and broker information to sample data if not present
  const enrichedTradeData = useMemo(() => {
    return sampleTradeData.map(trade => ({
      ...trade,
      setup: trade.setup || ['Breakout', 'Support/Resistance', 'Moving Average Cross', 'Trend Following', 'Range Trading'][Math.floor(Math.random() * 5)],
      broker: trade.broker || ['Binance', 'Coinbase', 'Kraken', 'Bybit', 'FTX'][Math.floor(Math.random() * 5)]
    }));
  }, []);

  // Filter trades based on current filters
  const filteredTrades = useMemo(() => {
    return enrichedTradeData.filter(trade => {
      // Filter by trade type
      if (filters.tradeType !== 'ALL' && trade.type !== filters.tradeType) {
        return false;
      }
      
      // Filter by order type
      if (filters.orderType !== 'ALL' && trade.orderType !== filters.orderType) {
        return false;
      }
      
      // Filter by broker
      if (filters.broker !== 'ALL' && trade.broker !== filters.broker) {
        return false;
      }
      
      // Filter by setup
      if (filters.setup !== 'ALL' && trade.setup !== filters.setup) {
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
  }, [enrichedTradeData, filters]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Crypto Trading Dashboard</h1>
      
      {/* Filters */}
      <FilterBar filters={filters} setFilters={setFilters} />
      
      {/* Performance Metrics */}
      <PerformanceMetrics trades={filteredTrades} />
      
      {/* Main Tabs Navigation */}
      <Tabs defaultValue="charts" className="mt-8">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="charts" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            <span>Charts</span>
          </TabsTrigger>
          <TabsTrigger value="distribution" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            <span>Distribution</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Table className="h-4 w-4" />
            <span>Trade History</span>
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span>Goals</span>
          </TabsTrigger>
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            <span>Calculator</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="charts">
          <TradeResultsChart trades={filteredTrades} />
        </TabsContent>
        
        <TabsContent value="distribution">
          <ReturnsDistribution trades={filteredTrades} />
        </TabsContent>
        
        <TabsContent value="history">
          <TradeTable trades={filteredTrades} />
        </TabsContent>
        
        <TabsContent value="goals">
          <GoalsTracker />
        </TabsContent>
        
        <TabsContent value="calculator">
          <TradeCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
