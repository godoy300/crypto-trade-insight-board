
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trade } from '../types/trade';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ReturnsDistributionProps {
  trades: Trade[];
}

const ReturnsDistribution: React.FC<ReturnsDistributionProps> = ({ trades }) => {
  // Prepare data for stop vs win chart
  const scatterData = React.useMemo(() => {
    return trades.map(trade => ({
      id: trade.id,
      stopPercentage: parseFloat((trade.stopPercentage * 100).toFixed(2)),
      winPercentage: parseFloat((trade.winPercentage * 100).toFixed(2)),
      result: trade.result,
      orderType: trade.orderType,
      type: trade.type,
      pair: trade.pair,
    }));
  }, [trades]);
  
  // Prepare datasets for the different categories
  const winTrades = scatterData.filter(t => t.result === 'WIN');
  const lossTrades = scatterData.filter(t => t.result === 'LOSS');

  return (
    <Card className="bg-card border-border mb-6">
      <CardHeader>
        <CardTitle>Stop vs Win Analysis</CardTitle>
        <CardDescription>Relationship between Stop Loss and Win Percentages</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                type="number" 
                dataKey="stopPercentage" 
                name="Stop %" 
                unit="%" 
                stroke="#9ca3af"
                label={{ value: 'Stop %', position: 'insideBottomRight', offset: -5, fill: '#9ca3af' }}
              />
              <YAxis 
                type="number" 
                dataKey="winPercentage" 
                name="Win %" 
                unit="%" 
                stroke="#9ca3af"
                label={{ value: 'Win %', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ 
                  backgroundColor: '#1f2937',
                  borderColor: '#374151',
                  borderRadius: '0.5rem',
                }}
                formatter={(value) => [`${value}%`, '']}
                labelFormatter={(value) => `Trade #${value}`}
              />
              <Legend />
              <Scatter 
                name="Win" 
                data={winTrades} 
                fill="#22c55e"
                shape="circle"
              />
              <Scatter 
                name="Loss" 
                data={lossTrades} 
                fill="#ef4444"
                shape="circle"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReturnsDistribution;
