
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trade } from '../types/trade';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ZAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Calculator } from 'lucide-react';

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
      // Calculate risk ratio for size of bubble (stop:win ratio)
      riskRatio: trade.stopPercentage > 0 
        ? parseFloat((trade.winPercentage / trade.stopPercentage).toFixed(2)) 
        : 0,
      // Convert risk ratio to bubble size
      z: trade.stopPercentage > 0 
        ? Math.min(Math.max(parseFloat((trade.winPercentage / trade.stopPercentage).toFixed(2)) * 20, 20), 100) 
        : 20,
    }));
  }, [trades]);
  
  // Prepare datasets for the different categories
  const winTrades = scatterData.filter(t => t.result === 'WIN');
  const lossTrades = scatterData.filter(t => t.result === 'LOSS');

  // Calculate average risk/reward ratio
  const avgRiskReward = React.useMemo(() => {
    if (trades.length === 0) return 0;
    
    const validTrades = trades.filter(t => t.stopPercentage > 0);
    if (validTrades.length === 0) return 0;
    
    const sum = validTrades.reduce((acc, trade) => 
      acc + (trade.winPercentage / trade.stopPercentage), 0);
    return parseFloat((sum / validTrades.length).toFixed(2));
  }, [trades]);

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-md p-3 shadow-lg">
          <p className="font-semibold">Trade #{data.id}</p>
          <p className="text-sm">{data.pair} - {data.type} ({data.orderType})</p>
          <p className={`text-sm ${data.result === 'WIN' ? 'text-profit' : 'text-loss'}`}>
            Result: {data.result}
          </p>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <p className="text-xs text-muted-foreground">Stop %</p>
              <p className="font-medium">{data.stopPercentage}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Win %</p>
              <p className="font-medium">{data.winPercentage}%</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-muted-foreground">Risk/Reward Ratio</p>
              <p className="font-medium">{data.riskRatio || 'N/A'}</p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-card border-border mb-6">
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Stop vs Win Analysis
          </CardTitle>
          <CardDescription>Relationship between Stop Loss and Win Percentages</CardDescription>
        </div>
        <div className="bg-muted/50 text-foreground py-1 px-3 rounded-full text-sm">
          Avg Risk/Reward: <span className="font-medium">{avgRiskReward || 'N/A'}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-96">
          <ChartContainer 
            className="h-full w-full" 
            config={{
              win: { color: "#22c55e" },
              loss: { color: "#ef4444" },
            }}
          >
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
              <ZAxis type="number" dataKey="z" range={[20, 100]} />
              <ChartTooltip content={<CustomTooltip />} />
              <Legend />
              
              {/* Reference line for 1:1 risk/reward */}
              <line 
                x1="0" 
                y1="0" 
                x2="100" 
                y2="100" 
                stroke="#9b87f5" 
                strokeWidth={1} 
                strokeDasharray="5 5"
              />
              
              {/* Win trades */}
              <Scatter 
                name="Win" 
                data={winTrades} 
                fill="#22c55e"
                shape="circle"
              />
              
              {/* Loss trades */}
              <Scatter 
                name="Loss" 
                data={lossTrades} 
                fill="#ef4444"
                shape="circle"
              />
            </ScatterChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReturnsDistribution;
