
import React, { useState } from 'react';
import { TradeFilters } from '../types/trade';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Search, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

interface FilterBarProps {
  filters: TradeFilters;
  setFilters: (filters: TradeFilters) => void;
}

const setupOptions = [
  'ALL',
  'Breakout',
  'Support/Resistance',
  'Moving Average Cross',
  'Trend Following',
  'Range Trading'
];

const brokerOptions = [
  'ALL',
  'Binance',
  'Coinbase',
  'Kraken',
  'Bybit',
  'FTX'
];

const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters }) => {
  const [startDate, setStartDate] = useState<Date | undefined>(
    filters.startDate ? new Date(filters.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    filters.endDate ? new Date(filters.endDate) : undefined
  );

  // Handle date changes
  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    setFilters({
      ...filters,
      startDate: date ? date.toISOString() : null
    });
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    setFilters({
      ...filters,
      endDate: date ? date.toISOString() : null
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      tradeType: 'ALL',
      orderType: 'ALL',
      startDate: null,
      endDate: null,
      broker: 'ALL',
      setup: 'ALL'
    });
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return (
    <Card className="mb-6">
      <CardContent className="py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Trade Type Filter */}
            <Select
              value={filters.tradeType}
              onValueChange={(value: any) =>
                setFilters({ ...filters, tradeType: value })
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Trade Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="LONG">Long</SelectItem>
                <SelectItem value="SHORT">Short</SelectItem>
              </SelectContent>
            </Select>

            {/* Order Type Filter */}
            <Select
              value={filters.orderType}
              onValueChange={(value: any) =>
                setFilters({ ...filters, orderType: value })
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Order Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Orders</SelectItem>
                <SelectItem value="MAKER">Maker</SelectItem>
                <SelectItem value="TAKER">Taker</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Broker Filter */}
            <Select
              value={filters.broker}
              onValueChange={(value: any) =>
                setFilters({ ...filters, broker: value })
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Broker" />
              </SelectTrigger>
              <SelectContent>
                {brokerOptions.map(broker => (
                  <SelectItem key={broker} value={broker}>
                    {broker === 'ALL' ? 'All Brokers' : broker}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Setup Filter */}
            <Select
              value={filters.setup}
              onValueChange={(value: any) =>
                setFilters({ ...filters, setup: value })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Setup" />
              </SelectTrigger>
              <SelectContent>
                {setupOptions.map(setup => (
                  <SelectItem key={setup} value={setup}>
                    {setup === 'ALL' ? 'All Setups' : setup}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Separator orientation="vertical" className="h-8 hidden sm:block" />

            {/* Date Range Filter */}
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[130px] justify-start"
                    size="sm"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "MMM dd") : "Start Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={handleStartDateChange}
                  />
                </PopoverContent>
              </Popover>

              <span className="text-muted-foreground">to</span>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[130px] justify-start"
                    size="sm"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "MMM dd") : "End Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={handleEndDateChange}
                    disabled={(date) => startDate ? date < startDate : false}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={resetFilters} size="sm">
              <X className="mr-2 h-4 w-4" />
              Reset Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterBar;
