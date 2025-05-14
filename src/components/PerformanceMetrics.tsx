
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trade } from '../types/trade';
import { calculateMetrics } from '../data/sampleTradeData';
import { TrendingUp, TrendingDown, BarChart, Percent, DollarSign, Scale } from 'lucide-react';

interface PerformanceMetricsProps {
  trades: Trade[];
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ trades }) => {
  const metrics = calculateMetrics(trades);

  const metricsData = [
    {
      title: 'Win Rate',
      value: `${metrics.winRate}%`,
      description: `${metrics.winTrades} out of ${metrics.totalTrades} trades`,
      icon: <Percent className="h-4 w-4 text-muted-foreground" />,
      color: parseFloat(metrics.winRate) > 50 ? 'text-profit' : 'text-loss',
    },
    {
      title: 'Total P&L',
      value: `$${parseFloat(metrics.totalProfit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      description: 'Net profit/loss',
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
      color: parseFloat(metrics.totalProfit) > 0 ? 'text-profit' : 'text-loss',
    },
    {
      title: 'Average Cost',
      value: `${(parseFloat(metrics.averageOperationCost) * 100).toFixed(3)}%`,
      description: 'Per operation',
      icon: <Scale className="h-4 w-4 text-muted-foreground" />,
      color: 'text-primary',
    },
    {
      title: 'Trade Direction',
      value: `${metrics.longTrades} Long | ${metrics.shortTrades} Short`,
      description: 'Distribution of trades',
      icon: <BarChart className="h-4 w-4 text-muted-foreground" />,
      color: 'text-primary',
    },
    {
      title: 'Order Types',
      value: `${metrics.makerTrades} Maker | ${metrics.takerTrades} Taker`,
      description: 'Distribution of orders',
      icon: <BarChart className="h-4 w-4 text-muted-foreground" />,
      color: 'text-primary',
    },
    {
      title: 'Average Leverage',
      value: `${metrics.averageLeverage}x`,
      description: 'Risk exposure',
      icon: parseFloat(metrics.averageLeverage) > 5 
        ? <TrendingUp className="h-4 w-4 text-muted-foreground" /> 
        : <TrendingDown className="h-4 w-4 text-muted-foreground" />,
      color: 'text-primary',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {metricsData.map((metric, index) => (
        <Card key={index} className="bg-card border-border">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              {metric.icon}
            </div>
            <CardDescription>{metric.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${metric.color}`}>
              {metric.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PerformanceMetrics;
