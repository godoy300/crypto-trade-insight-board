
import React from 'react';
import { TradeFilters } from '../types/trade';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DateRange } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  filters: TradeFilters;
  setFilters: React.Dispatch<React.SetStateAction<TradeFilters>>;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters }) => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: filters.startDate ? new Date(filters.startDate) : undefined,
    to: filters.endDate ? new Date(filters.endDate) : undefined,
  });

  const handleDateChange = (range: DateRange | undefined) => {
    setDate(range);
    setFilters(prev => ({
      ...prev,
      startDate: range?.from ? range.from.toISOString() : null,
      endDate: range?.to ? range.to.toISOString() : null,
    }));
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-lg mb-6">
      <div className="flex-1">
        <Label htmlFor="trade-type" className="mb-2 block">Trade Type</Label>
        <Select
          value={filters.tradeType}
          onValueChange={(value) => setFilters(prev => ({ ...prev, tradeType: value as any }))}
        >
          <SelectTrigger id="trade-type" className="w-full">
            <SelectValue placeholder="Select Trade Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="LONG">Long</SelectItem>
              <SelectItem value="SHORT">Short</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <Label htmlFor="order-type" className="mb-2 block">Order Type</Label>
        <Select
          value={filters.orderType}
          onValueChange={(value) => setFilters(prev => ({ ...prev, orderType: value as any }))}
        >
          <SelectTrigger id="order-type" className="w-full">
            <SelectValue placeholder="Select Order Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="MAKER">Maker</SelectItem>
              <SelectItem value="TAKER">Taker</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <Label className="mb-2 block">Date Range</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={date}
              onSelect={handleDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default FilterBar;
