
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TradeType, OrderType } from '../types/trade';
import { Calculator } from 'lucide-react';

const TradeCalculator = () => {
  const [tradeType, setTradeType] = useState<TradeType>('LONG');
  const [orderType, setOrderType] = useState<OrderType>('MAKER');
  const [margin, setMargin] = useState<number>(100);
  const [leverage, setLeverage] = useState<number>(5);
  const [entryPrice, setEntryPrice] = useState<number>(50000);
  const [targetPrice, setTargetPrice] = useState<number>(55000);
  const [stopPrice, setStopPrice] = useState<number>(45000);
  
  const [makerFee, setMakerFee] = useState<number>(0.02);  // 0.02%
  const [takerFee, setTakerFee] = useState<number>(0.06);  // 0.06%
  
  const [positionSize, setPositionSize] = useState<number>(0);
  const [winAmount, setWinAmount] = useState<number>(0);
  const [winPercentage, setWinPercentage] = useState<number>(0);
  const [stopAmount, setStopAmount] = useState<number>(0);
  const [stopPercentage, setStopPercentage] = useState<number>(0);
  const [entryFee, setEntryFee] = useState<number>(0);
  const [exitWinFee, setExitWinFee] = useState<number>(0);
  const [exitStopFee, setExitStopFee] = useState<number>(0);
  const [riskReward, setRiskReward] = useState<number>(0);
  const [netProfitLoss, setNetProfitLoss] = useState<number>(0);
  
  // Calculate position size
  useEffect(() => {
    const size = margin * leverage;
    setPositionSize(size);
  }, [margin, leverage]);
  
  // Calculate entry fee
  useEffect(() => {
    const feeRate = orderType === 'MAKER' ? makerFee / 100 : takerFee / 100;
    const fee = positionSize * feeRate;
    setEntryFee(fee);
  }, [positionSize, orderType, makerFee, takerFee]);
  
  // Calculate win/loss percentages and amounts
  useEffect(() => {
    if (tradeType === 'LONG') {
      const winPct = (targetPrice - entryPrice) / entryPrice;
      const stopPct = (entryPrice - stopPrice) / entryPrice;
      
      setWinPercentage(winPct * 100);
      setStopPercentage(stopPct * 100);
      
      setWinAmount(positionSize * winPct);
      setStopAmount(positionSize * stopPct);
    } else {
      // SHORT calculations
      const winPct = (entryPrice - targetPrice) / entryPrice;
      const stopPct = (stopPrice - entryPrice) / entryPrice;
      
      setWinPercentage(winPct * 100);
      setStopPercentage(stopPct * 100);
      
      setWinAmount(positionSize * winPct);
      setStopAmount(positionSize * stopPct);
    }
  }, [tradeType, entryPrice, targetPrice, stopPrice, positionSize]);
  
  // Calculate exit fees and risk/reward
  useEffect(() => {
    const feeRate = orderType === 'MAKER' ? makerFee / 100 : takerFee / 100;
    
    // Exit fees (includes profits/losses in calculation)
    const exitWinFee = (positionSize + winAmount) * feeRate;
    const exitStopFee = (positionSize - stopAmount) * feeRate;
    
    setExitWinFee(exitWinFee);
    setExitStopFee(exitStopFee);
    
    // Risk reward ratio
    if (stopAmount > 0) {
      setRiskReward(parseFloat((winAmount / stopAmount).toFixed(2)));
    } else {
      setRiskReward(0);
    }
    
    // Net profit/loss calculation
    const netProfit = winAmount - entryFee - exitWinFee;
    setNetProfitLoss(netProfit);
    
  }, [winAmount, stopAmount, positionSize, orderType, makerFee, takerFee, entryFee]);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Trade Calculator
        </CardTitle>
        <CardDescription>Calculate potential profit/loss and risk/reward ratio</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="setup" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="setup">Trade Setup</TabsTrigger>
            <TabsTrigger value="fees">Fees</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tradeType">Trade Type</Label>
                  <Select 
                    value={tradeType} 
                    onValueChange={(value) => setTradeType(value as TradeType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LONG">LONG</SelectItem>
                      <SelectItem value="SHORT">SHORT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="orderType">Order Type</Label>
                  <Select 
                    value={orderType} 
                    onValueChange={(value) => setOrderType(value as OrderType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select order type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MAKER">MAKER</SelectItem>
                      <SelectItem value="TAKER">TAKER</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="margin">Margin ($)</Label>
                  <Input 
                    id="margin"
                    type="number"
                    value={margin}
                    onChange={(e) => setMargin(parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="leverage">Leverage (x)</Label>
                  <Input 
                    id="leverage"
                    type="number"
                    value={leverage}
                    onChange={(e) => setLeverage(parseFloat(e.target.value) || 1)}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="entryPrice">Entry Price ($)</Label>
                  <Input 
                    id="entryPrice"
                    type="number"
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="targetPrice">Target Price ($)</Label>
                  <Input 
                    id="targetPrice"
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stopPrice">Stop Price ($)</Label>
                  <Input 
                    id="stopPrice"
                    type="number"
                    value={stopPrice}
                    onChange={(e) => setStopPrice(parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <div className="pt-4">
                  <div className="p-4 bg-muted rounded-md">
                    <div className="text-sm font-medium text-foreground">Position Size:</div>
                    <div className="text-2xl font-bold">${positionSize.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="fees" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="makerFee">Maker Fee (%)</Label>
                  <Input 
                    id="makerFee"
                    type="number"
                    step="0.01"
                    value={makerFee}
                    onChange={(e) => setMakerFee(parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="takerFee">Taker Fee (%)</Label>
                  <Input 
                    id="takerFee"
                    type="number"
                    step="0.01"
                    value={takerFee}
                    onChange={(e) => setTakerFee(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-md">
                  <div className="text-sm font-medium text-foreground">Entry Fee:</div>
                  <div className="text-xl font-bold">${entryFee.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">
                    ({orderType === 'MAKER' ? makerFee : takerFee}% of position size)
                  </div>
                </div>
                
                <div className="p-4 bg-muted rounded-md">
                  <div className="text-sm font-medium text-foreground">Exit Fee (at target):</div>
                  <div className="text-xl font-bold">${exitWinFee.toFixed(2)}</div>
                </div>
                
                <div className="p-4 bg-muted rounded-md">
                  <div className="text-sm font-medium text-foreground">Exit Fee (at stop):</div>
                  <div className="text-xl font-bold">${exitStopFee.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="results" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-md">
                  <div className="text-sm font-medium text-foreground">Win Scenario:</div>
                  <div className="text-2xl font-bold text-profit">+${winAmount.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">(+{winPercentage.toFixed(2)}%)</div>
                </div>
                
                <div className="p-4 bg-muted rounded-md">
                  <div className="text-sm font-medium text-foreground">Loss Scenario:</div>
                  <div className="text-2xl font-bold text-loss">-${stopAmount.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">(-{stopPercentage.toFixed(2)}%)</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-md">
                  <div className="text-sm font-medium text-foreground">Risk/Reward Ratio:</div>
                  <div className="text-2xl font-bold">{riskReward}</div>
                  <div className="text-xs text-muted-foreground">
                    (Win Amount / Loss Amount)
                  </div>
                </div>
                
                <div className="p-4 bg-muted rounded-md">
                  <div className="text-sm font-medium text-foreground">Net Profit (after fees):</div>
                  <div className="text-2xl font-bold text-profit">
                    ${netProfitLoss.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    (Win amount - Entry Fee - Exit Fee)
                  </div>
                </div>
                
                <div className={`p-4 rounded-md ${riskReward >= 2 ? 'bg-profit/20' : riskReward >= 1 ? 'bg-primary/20' : 'bg-loss/20'}`}>
                  <div className="text-sm font-medium text-foreground">Trade Quality:</div>
                  <div className={`text-xl font-bold ${riskReward >= 2 ? 'text-profit' : riskReward >= 1 ? 'text-primary' : 'text-loss'}`}>
                    {riskReward >= 2 ? 'Excellent' : riskReward >= 1 ? 'Good' : 'Poor'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    (Based on Risk/Reward ratio)
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TradeCalculator;
