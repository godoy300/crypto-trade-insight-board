
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trade } from '../types/trade';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TradeResultsChartProps {
  trades: Trade[];
}

const TradeResultsChart: React.FC<TradeResultsChartProps> = ({ trades }) => {
  // Prepare data for chart - group by result and order type
  const chartData = React.useMemo(() => {
    const winMaker = trades.filter(t => t.result === 'WIN' && t.orderType === 'MAKER').length;
    const winTaker = trades.filter(t => t.result === 'WIN' && t.orderType === 'TAKER').length;
    const lossMaker = trades.filter(t => t.result === 'LOSS' && t.orderType === 'MAKER').length;
    const lossTaker = trades.filter(t => t.result === 'LOSS' && t.orderType === 'TAKER').length;

    return [
      {
        name: 'Win',
        Maker: winMaker,
        Taker: winTaker,
      },
      {
        name: 'Loss',
        Maker: lossMaker,
        Taker: lossTaker,
      }
    ];
  }, [trades]);
  
  // Prepare data for profit/loss chart
  const profitLossData = React.useMemo(() => {
    // Group trades by result type and calculate total profit/loss
    const winProfit = trades
      .filter(t => t.result === 'WIN')
      .reduce((acc, trade) => {
        const profit = trade.margin * trade.leverage * trade.winPercentage - trade.entryFee - trade.exitFee;
        return acc + profit;
      }, 0);
      
    const lossAmount = trades
      .filter(t => t.result === 'LOSS')
      .reduce((acc, trade) => {
        const loss = trade.margin * trade.leverage * trade.stopPercentage + trade.entryFee + trade.exitFee;
        return acc + loss;
      }, 0);
      
    return [
      {
        name: 'P&L',
        Profit: parseFloat(winProfit.toFixed(2)),
        Loss: -parseFloat(lossAmount.toFixed(2)),
      }
    ];
  }, [trades]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Trade Results</CardTitle>
          <CardDescription>Win/Loss Distribution by Order Type</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937',
                    borderColor: '#374151',
                    borderRadius: '0.5rem',
                  }}
                />
                <Legend />
                <Bar dataKey="Maker" name="Maker" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Taker" name="Taker" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Profit & Loss</CardTitle>
          <CardDescription>Total Profit vs Loss (USD)</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={profitLossData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937',
                    borderColor: '#374151',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value) => [`$${value}`, value > 0 ? 'Profit' : 'Loss']}
                />
                <Legend />
                <Bar dataKey="Profit" name="Profit" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Loss" name="Loss" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TradeResultsChart;
