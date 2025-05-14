
import React, { useState } from 'react';
import { Trade } from '../types/trade';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, TrendingUp, TrendingDown } from 'lucide-react';

interface TradeTableProps {
  trades: Trade[];
}

const TradeTable: React.FC<TradeTableProps> = ({ trades }) => {
  const [activeTab, setActiveTab] = useState<string>('history');
  
  // Calculate risk/reward for each trade
  const tradesWithRiskReward = trades.map(trade => {
    const riskReward = trade.stopPercentage > 0 
      ? parseFloat((trade.winPercentage / trade.stopPercentage).toFixed(2)) 
      : 0;
    return {
      ...trade,
      riskReward
    };
  });
  
  // Group trades by broker
  const brokerGroups = tradesWithRiskReward.reduce((groups, trade) => {
    const broker = trade.broker || 'Unknown';
    if (!groups[broker]) {
      groups[broker] = [];
    }
    groups[broker].push(trade);
    return groups;
  }, {} as Record<string, typeof tradesWithRiskReward>);
  
  // Calculate metrics for each broker
  const brokerMetrics = Object.entries(brokerGroups).map(([broker, trades]) => {
    const totalTrades = trades.length;
    const winTrades = trades.filter(t => t.result === 'WIN').length;
    const winRate = totalTrades > 0 ? (winTrades / totalTrades) * 100 : 0;
    
    const avgRiskReward = trades
      .filter(t => t.riskReward > 0)
      .reduce((sum, t) => sum + t.riskReward, 0) / 
      (trades.filter(t => t.riskReward > 0).length || 1);
    
    const totalPnl = trades.reduce((sum, t) => {
      return sum + (t.result === 'WIN' 
        ? t.margin * t.leverage * t.winPercentage 
        : -t.margin * t.leverage * t.stopPercentage);
    }, 0);
    
    const avgOperationCost = trades.reduce((sum, t) => sum + t.operationCost, 0) / totalTrades;
    
    return {
      broker,
      totalTrades,
      winTrades,
      winRate: winRate.toFixed(2),
      avgRiskReward: avgRiskReward.toFixed(2),
      totalPnl: totalPnl.toFixed(2),
      avgOperationCost: (avgOperationCost * 100).toFixed(3)
    };
  });

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Trade Analysis</CardTitle>
        <CardDescription>Detailed overview of trading operations and broker analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="history" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="history">Trade History</TabsTrigger>
            <TabsTrigger value="risk-reward">Risk/Reward Analysis</TabsTrigger>
            <TabsTrigger value="brokers">Broker Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="history">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Pair</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead className="text-right">Entry Price</TableHead>
                    <TableHead className="text-right">Exit Price</TableHead>
                    <TableHead className="text-right">Margin</TableHead>
                    <TableHead className="text-right">Leverage</TableHead>
                    <TableHead className="text-right">P&L %</TableHead>
                    <TableHead className="text-right">Op. Cost</TableHead>
                    <TableHead>Broker</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tradesWithRiskReward.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell>
                        {format(new Date(trade.date), "MMM dd")}
                      </TableCell>
                      <TableCell>{trade.pair}</TableCell>
                      <TableCell>
                        <Badge variant={trade.type === 'LONG' ? 'default' : 'outline'}>
                          {trade.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={trade.orderType === 'MAKER' ? 'bg-maker/20 text-maker' : 'bg-taker/20 text-taker'}>
                          {trade.orderType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={trade.result === 'WIN' ? 'default' : 'destructive'} className={trade.result === 'WIN' ? 'bg-profit/20 text-profit' : 'bg-loss/20 text-loss'}>
                          {trade.result}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">${trade.entryPrice.toLocaleString()}</TableCell>
                      <TableCell className="text-right">${trade.exitPrice.toLocaleString()}</TableCell>
                      <TableCell className="text-right">${trade.margin.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{trade.leverage}x</TableCell>
                      <TableCell className={`text-right ${trade.result === 'WIN' ? 'text-profit' : 'text-loss'}`}>
                        {trade.result === 'WIN' 
                          ? `+${(trade.winPercentage * 100).toFixed(2)}%`
                          : `-${(trade.stopPercentage * 100).toFixed(2)}%`}
                      </TableCell>
                      <TableCell className="text-right">{(trade.operationCost * 100).toFixed(3)}%</TableCell>
                      <TableCell>{trade.broker || 'Unknown'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="risk-reward">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Pair</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Stop %</TableHead>
                    <TableHead className="text-right">Target %</TableHead>
                    <TableHead className="text-right">Risk/Reward</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Risk Analysis</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tradesWithRiskReward.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell>
                        {format(new Date(trade.date), "MMM dd")}
                      </TableCell>
                      <TableCell>{trade.pair}</TableCell>
                      <TableCell>
                        <Badge variant={trade.type === 'LONG' ? 'default' : 'outline'}>
                          {trade.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-loss font-medium">
                        {(trade.stopPercentage * 100).toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-right text-profit font-medium">
                        {(trade.winPercentage * 100).toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {trade.riskReward > 0 ? trade.riskReward.toFixed(2) : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={trade.result === 'WIN' ? 'default' : 'destructive'} className={trade.result === 'WIN' ? 'bg-profit/20 text-profit' : 'bg-loss/20 text-loss'}>
                          {trade.result}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {trade.riskReward >= 2 ? (
                            <span className="flex items-center text-profit">
                              <TrendingUp className="w-4 h-4 mr-1" /> Excellent
                            </span>
                          ) : trade.riskReward >= 1 ? (
                            <span className="flex items-center text-primary">
                              <TrendingUp className="w-4 h-4 mr-1" /> Good
                            </span>
                          ) : (
                            <span className="flex items-center text-loss">
                              <TrendingDown className="w-4 h-4 mr-1" /> Poor
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="brokers">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Broker</TableHead>
                    <TableHead className="text-right">Total Trades</TableHead>
                    <TableHead className="text-right">Win Rate</TableHead>
                    <TableHead className="text-right">Avg Risk/Reward</TableHead>
                    <TableHead className="text-right">Total P&L</TableHead>
                    <TableHead className="text-right">Avg Op. Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {brokerMetrics.map((metric) => (
                    <TableRow key={metric.broker}>
                      <TableCell className="font-medium">{metric.broker}</TableCell>
                      <TableCell className="text-right">{metric.totalTrades}</TableCell>
                      <TableCell className="text-right">{metric.winRate}%</TableCell>
                      <TableCell className="text-right">{metric.avgRiskReward}</TableCell>
                      <TableCell className={`text-right ${parseFloat(metric.totalPnl) >= 0 ? 'text-profit' : 'text-loss'}`}>
                        {parseFloat(metric.totalPnl) >= 0 ? '+' : ''}{metric.totalPnl}
                      </TableCell>
                      <TableCell className="text-right">{metric.avgOperationCost}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TradeTable;
