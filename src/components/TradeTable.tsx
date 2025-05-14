
import React from 'react';
import { Trade } from '../types/trade';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface TradeTableProps {
  trades: Trade[];
}

const TradeTable: React.FC<TradeTableProps> = ({ trades }) => {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Trade History</CardTitle>
        <CardDescription>Detailed overview of all trading operations</CardDescription>
      </CardHeader>
      <CardContent>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.map((trade) => (
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradeTable;
