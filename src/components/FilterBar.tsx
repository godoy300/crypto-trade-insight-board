
import React, { useState, useEffect, useMemo } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TradeFilters } from '../types/trade';
import { format } from 'date-fns';
import { sampleTradeData } from '../data/sampleTradeData';

interface FilterBarProps {
  filters: TradeFilters;
  setFilters: React.Dispatch<React.SetStateAction<TradeFilters>>;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters }) => {
  const [startDate, setStartDate] = useState<Date | undefined>(
    filters.startDate ? new Date(filters.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    filters.endDate ? new Date(filters.endDate) : undefined
  );

  // Get unique list of brokers from sample data
  const brokers = useMemo(() => {
    const uniqueBrokers = new Set<string>();
    sampleTradeData.forEach(trade => {
      if (trade.broker) {
        uniqueBrokers.add(trade.broker);
      }
    });
    return Array.from(uniqueBrokers);
  }, []);

  // Update filters when dates change
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      startDate: startDate ? format(startDate, 'yyyy-MM-dd') : null,
      endDate: endDate ? format(endDate, 'yyyy-MM-dd') : null,
    }));
  }, [startDate, endDate, setFilters]);

  const handleTradeTypeChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      tradeType: value as TradeFilters['tradeType'],
    }));
  };

  const handleOrderTypeChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      orderType: value as TradeFilters['orderType'],
    }));
  };

  const handleBrokerChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      broker: value as TradeFilters['broker'],
    }));
  };

  const clearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setFilters({
      tradeType: 'ALL',
      orderType: 'ALL',
      startDate: null,
      endDate: null,
      broker: 'ALL',
    });
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[150px]">
            <Select
              value={filters.tradeType}
              onValueChange={handleTradeTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Trade Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="LONG">Long</SelectItem>
                <SelectItem value="SHORT">Short</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[150px]">
            <Select
              value={filters.orderType}
              onValueChange={handleOrderTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Order Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Orders</SelectItem>
                <SelectItem value="MAKER">Maker</SelectItem>
                <SelectItem value="TAKER">Taker</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[150px]">
            <Select
              value={filters.broker || 'ALL'}
              onValueChange={handleBrokerChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Broker" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Brokers</SelectItem>
                {brokers.map((broker) => (
                  <SelectItem key={broker} value={broker}>{broker}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[150px]">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  {startDate ? format(startDate, 'PPP') : 'Start Date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex-1 min-w-[150px]">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  {endDate ? format(endDate, 'PPP') : 'End Date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button 
            variant="outline" 
            className="ml-auto" 
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterBar;
