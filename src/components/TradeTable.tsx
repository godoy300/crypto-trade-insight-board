
import React, { useState } from 'react';
import { Trade } from '../types/trade';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, TrendingUp, TrendingDown, Star, Target, Flag } from 'lucide-react';

interface TradeTableProps {
  trades: Trade[];
}

const TradeTable: React.FC<TradeTableProps> = ({ trades }) => {
  const [activeTab, setActiveTab] = useState<string>('history');
  
  // Calculate risk/reward and target prices for each trade
  const tradesWithTargets = trades.map(trade => {
    // Calculate risk/reward ratio
    const riskReward = trade.stopPercentage > 0 
      ? parseFloat((trade.winPercentage / trade.stopPercentage).toFixed(2)) 
      : 0;
    
    // Calculate target prices based on stop percentage and entry price
    let target1Price = 0;
    let target2Price = trade.target2Price || 0;
    let target3Price = trade.target3Price || 0;
    
    if (trade.type === 'LONG') {
      // For LONG positions: entry + (entry * stopPercentage)
      target1Price = trade.entryPrice + (trade.entryPrice * trade.stopPercentage);
    } else {
      // For SHORT positions: entry - (entry * stopPercentage)
      target1Price = trade.entryPrice - (trade.entryPrice * trade.stopPercentage);
    }
    
    return {
      ...trade,
      riskReward,
      setup: trade.setup || 'Unknown',
      target1Price: parseFloat(target1Price.toFixed(2)),
      target2Price,
      target3Price
    };
  });
  
  // Group trades by broker
  const brokerGroups = tradesWithTargets.reduce((groups, trade) => {
    const broker = trade.broker || 'Unknown';
    if (!groups[broker]) {
      groups[broker] = [];
    }
    groups[broker].push(trade);
    return groups;
  }, {} as Record<string, typeof tradesWithTargets>);
  
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

  // Group trades by setup
  const setupGroups = tradesWithTargets.reduce((groups, trade) => {
    const setup = trade.setup || 'Unknown';
    if (!groups[setup]) {
      groups[setup] = [];
    }
    groups[setup].push(trade);
    return groups;
  }, {} as Record<string, typeof tradesWithTargets>);
  
  // Calculate metrics for each setup
  const setupMetrics = Object.entries(setupGroups).map(([setup, trades]) => {
    const totalTrades = trades.length;
    const winTrades = trades.filter(t => t.result === 'WIN').length;
    const winRate = totalTrades > 0 ? (winTrades / totalTrades) * 100 : 0;
    
    const totalPnl = trades.reduce((sum, t) => {
      return sum + (t.result === 'WIN' 
        ? t.margin * t.leverage * t.winPercentage 
        : -t.margin * t.leverage * t.stopPercentage);
    }, 0);
    
    const avgRiskReward = trades
      .filter(t => t.riskReward > 0)
      .reduce((sum, t) => sum + t.riskReward, 0) / 
      (trades.filter(t => t.riskReward > 0).length || 1);
    
    const profitability = totalPnl / totalTrades;
    
    return {
      setup,
      totalTrades,
      winTrades,
      winRate: winRate.toFixed(2),
      totalPnl: totalPnl.toFixed(2),
      avgRiskReward: avgRiskReward.toFixed(2),
      profitability: profitability.toFixed(2)
    };
  }).sort((a, b) => parseFloat(b.profitability) - parseFloat(a.profitability));

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Trade Analysis</CardTitle>
        <CardDescription>Detailed overview of trading operations, setups and broker analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="history" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="history">
              <Table className="h-4 w-4 mr-1" />
              Trade History
            </TabsTrigger>
            <TabsTrigger value="targets">
              <Target className="h-4 w-4 mr-1" />
              Target Analysis
            </TabsTrigger>
            <TabsTrigger value="risk-reward">
              <Flag className="h-4 w-4 mr-1" />
              Risk/Reward Analysis
            </TabsTrigger>
            <TabsTrigger value="brokers">
              <TrendingUp className="h-4 w-4 mr-1" />
              Broker Analysis
            </TabsTrigger>
            <TabsTrigger value="setups">
              <Star className="h-4 w-4 mr-1" />
              Setup Analysis
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="history">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Pair</TableHead>
                    <TableHead>Setup</TableHead>
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
                  {tradesWithTargets.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell>
                        {format(new Date(trade.date), "MMM dd")}
                      </TableCell>
                      <TableCell>{trade.pair}</TableCell>
                      <TableCell>{trade.setup}</TableCell>
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
          
          <TabsContent value="targets">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Pair</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Entry Price</TableHead>
                    <TableHead className="text-right">Stop %</TableHead>
                    <TableHead className="text-right">Target 1 (1:1)</TableHead>
                    <TableHead className="text-right">Target 2</TableHead>
                    <TableHead className="text-right">Target 3</TableHead>
                    <TableHead className="text-right">Exit Price</TableHead>
                    <TableHead>Position Value</TableHead>
                    <TableHead>Target 1 Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tradesWithTargets.map((trade) => {
                    const positionValue = trade.margin * trade.leverage;
                    const target1Value = positionValue * 0.5; // 50% of position value
                    
                    return (
                      <TableRow key={trade.id}>
                        <TableCell>{format(new Date(trade.date), "MMM dd")}</TableCell>
                        <TableCell>{trade.pair}</TableCell>
                        <TableCell>
                          <Badge variant={trade.type === 'LONG' ? 'default' : 'outline'}>
                            {trade.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">${trade.entryPrice.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-loss">
                          {(trade.stopPercentage * 100).toFixed(2)}%
                        </TableCell>
                        <TableCell className="text-right text-profit font-medium">
                          ${trade.target1Price.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {trade.target2Price ? '$' + trade.target2Price.toLocaleString() : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {trade.target3Price ? '$' + trade.target3Price.toLocaleString() : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          ${trade.exitPrice.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          ${positionValue.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          ${target1Value.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
                    <TableHead>Setup</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Stop %</TableHead>
                    <TableHead className="text-right">Target %</TableHead>
                    <TableHead className="text-right">Risk/Reward</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Risk Analysis</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tradesWithTargets.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell>
                        {format(new Date(trade.date), "MMM dd")}
                      </TableCell>
                      <TableCell>{trade.pair}</TableCell>
                      <TableCell>{trade.setup}</TableCell>
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
          
          <TabsContent value="setups">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Setup</TableHead>
                    <TableHead className="text-right">Total Trades</TableHead>
                    <TableHead className="text-right">Win Rate</TableHead>
                    <TableHead className="text-right">Avg Risk/Reward</TableHead>
                    <TableHead className="text-right">Total P&L</TableHead>
                    <TableHead className="text-right">Profitability</TableHead>
                    <TableHead>Ranking</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {setupMetrics.map((metric, index) => (
                    <TableRow key={metric.setup}>
                      <TableCell className="font-medium">{metric.setup}</TableCell>
                      <TableCell className="text-right">{metric.totalTrades}</TableCell>
                      <TableCell className="text-right">{metric.winRate}%</TableCell>
                      <TableCell className="text-right">{metric.avgRiskReward}</TableCell>
                      <TableCell className={`text-right ${parseFloat(metric.totalPnl) >= 0 ? 'text-profit' : 'text-loss'}`}>
                        {parseFloat(metric.totalPnl) >= 0 ? '+' : ''}{metric.totalPnl}
                      </TableCell>
                      <TableCell className={`text-right ${parseFloat(metric.profitability) >= 0 ? 'text-profit' : 'text-loss'}`}>
                        {parseFloat(metric.profitability) >= 0 ? '+' : ''}${metric.profitability}
                      </TableCell>
                      <TableCell>
                        {index === 0 ? (
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="text-yellow-500 font-medium">Best Setup</span>
                          </div>
                        ) : index === 1 ? (
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-gray-300 mr-1" />
                            <span className="text-gray-400">2nd Best</span>
                          </div>
                        ) : index === 2 ? (
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-amber-600 mr-1" />
                            <span className="text-amber-600">3rd Best</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">{index + 1}th</span>
                        )}
                      </TableCell>
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
