
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TradeType, OrderType } from '../types/trade';
import { Calculator, Target } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const TradeCalculator = () => {
  const [tradeType, setTradeType] = useState<TradeType>('LONG');
  const [orderType, setOrderType] = useState<OrderType>('MAKER');
  const [margin, setMargin] = useState<number>(100);
  const [leverage, setLeverage] = useState<number>(5);
  const [entryPrice, setEntryPrice] = useState<number>(50000);
  const [targetPrice1, setTargetPrice1] = useState<number>(55000);
  const [targetPrice2, setTargetPrice2] = useState<number>(60000);
  const [targetPrice3, setTargetPrice3] = useState<number>(65000);
  const [stopPrice, setStopPrice] = useState<number>(45000);
  
  const [makerFee, setMakerFee] = useState<number>(0.02);  // 0.02%
  const [takerFee, setTakerFee] = useState<number>(0.06);  // 0.06%
  
  const [positionSize, setPositionSize] = useState<number>(0);
  const [winAmount1, setWinAmount1] = useState<number>(0);
  const [winAmount2, setWinAmount2] = useState<number>(0);
  const [winAmount3, setWinAmount3] = useState<number>(0);
  const [winPercentage1, setWinPercentage1] = useState<number>(0);
  const [winPercentage2, setWinPercentage2] = useState<number>(0);
  const [winPercentage3, setWinPercentage3] = useState<number>(0);
  const [stopAmount, setStopAmount] = useState<number>(0);
  const [stopPercentage, setStopPercentage] = useState<number>(0);
  const [entryFee, setEntryFee] = useState<number>(0);
  const [exitWinFee1, setExitWinFee1] = useState<number>(0);
  const [exitWinFee2, setExitWinFee2] = useState<number>(0);
  const [exitWinFee3, setExitWinFee3] = useState<number>(0);
  const [exitStopFee, setExitStopFee] = useState<number>(0);
  const [riskReward1, setRiskReward1] = useState<number>(0);
  const [riskReward2, setRiskReward2] = useState<number>(0);
  const [riskReward3, setRiskReward3] = useState<number>(0);
  const [netProfitLoss1, setNetProfitLoss1] = useState<number>(0);
  const [netProfitLoss2, setNetProfitLoss2] = useState<number>(0);
  const [netProfitLoss3, setNetProfitLoss3] = useState<number>(0);
  
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
      // Target 1
      const winPct1 = (targetPrice1 - entryPrice) / entryPrice;
      setWinPercentage1(winPct1 * 100);
      setWinAmount1(positionSize * winPct1);
      
      // Target 2
      const winPct2 = (targetPrice2 - entryPrice) / entryPrice;
      setWinPercentage2(winPct2 * 100);
      setWinAmount2(positionSize * winPct2);
      
      // Target 3
      const winPct3 = (targetPrice3 - entryPrice) / entryPrice;
      setWinPercentage3(winPct3 * 100);
      setWinAmount3(positionSize * winPct3);
      
      // Stop
      const stopPct = (entryPrice - stopPrice) / entryPrice;
      setStopPercentage(stopPct * 100);
      setStopAmount(positionSize * stopPct);
    } else {
      // SHORT calculations
      // Target 1
      const winPct1 = (entryPrice - targetPrice1) / entryPrice;
      setWinPercentage1(winPct1 * 100);
      setWinAmount1(positionSize * winPct1);
      
      // Target 2
      const winPct2 = (entryPrice - targetPrice2) / entryPrice;
      setWinPercentage2(winPct2 * 100);
      setWinAmount2(positionSize * winPct2);
      
      // Target 3
      const winPct3 = (entryPrice - targetPrice3) / entryPrice;
      setWinPercentage3(winPct3 * 100);
      setWinAmount3(positionSize * winPct3);
      
      // Stop
      const stopPct = (stopPrice - entryPrice) / entryPrice;
      setStopPercentage(stopPct * 100);
      setStopAmount(positionSize * stopPct);
    }
  }, [tradeType, entryPrice, targetPrice1, targetPrice2, targetPrice3, stopPrice, positionSize]);
  
  // Calculate exit fees and risk/reward
  useEffect(() => {
    const feeRate = orderType === 'MAKER' ? makerFee / 100 : takerFee / 100;
    
    // Exit fees (includes profits/losses in calculation)
    const exitWinFee1 = (positionSize + winAmount1) * feeRate;
    const exitWinFee2 = (positionSize + winAmount2) * feeRate;
    const exitWinFee3 = (positionSize + winAmount3) * feeRate;
    const exitStopFee = (positionSize - stopAmount) * feeRate;
    
    setExitWinFee1(exitWinFee1);
    setExitWinFee2(exitWinFee2);
    setExitWinFee3(exitWinFee3);
    setExitStopFee(exitStopFee);
    
    // Risk reward ratio
    if (stopAmount > 0) {
      setRiskReward1(parseFloat((winAmount1 / stopAmount).toFixed(2)));
      setRiskReward2(parseFloat((winAmount2 / stopAmount).toFixed(2)));
      setRiskReward3(parseFloat((winAmount3 / stopAmount).toFixed(2)));
    } else {
      setRiskReward1(0);
      setRiskReward2(0);
      setRiskReward3(0);
    }
    
    // Net profit/loss calculation
    const netProfit1 = winAmount1 - entryFee - exitWinFee1;
    const netProfit2 = winAmount2 - entryFee - exitWinFee2;
    const netProfit3 = winAmount3 - entryFee - exitWinFee3;
    
    setNetProfitLoss1(netProfit1);
    setNetProfitLoss2(netProfit2);
    setNetProfitLoss3(netProfit3);
    
  }, [winAmount1, winAmount2, winAmount3, stopAmount, positionSize, orderType, makerFee, takerFee, entryFee]);

  // Special 1:1 Target calculation (50% of initial margin)
  const calculateTarget1to1 = () => {
    const targetAmount = margin * 0.5; // 50% of margin
    if (tradeType === 'LONG') {
      // For LONG, need price to increase to get the target amount
      const requiredPercentage = targetAmount / positionSize;
      const calculatedTargetPrice = entryPrice * (1 + requiredPercentage);
      setTargetPrice1(calculatedTargetPrice);
    } else {
      // For SHORT, need price to decrease to get the target amount
      const requiredPercentage = targetAmount / positionSize;
      const calculatedTargetPrice = entryPrice * (1 - requiredPercentage);
      setTargetPrice1(calculatedTargetPrice);
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Trade Calculator
        </CardTitle>
        <CardDescription>Calculate potential profit/loss and risk/reward ratio with multiple targets</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="setup" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="setup">Trade Setup</TabsTrigger>
            <TabsTrigger value="fees">Fees</TabsTrigger>
            <TabsTrigger value="targets">Targets</TabsTrigger>
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
                  <div className="text-sm font-medium text-foreground">Exit Fee (at Target 1):</div>
                  <div className="text-xl font-bold">${exitWinFee1.toFixed(2)}</div>
                </div>
                
                <div className="p-4 bg-muted rounded-md">
                  <div className="text-sm font-medium text-foreground">Exit Fee (at Stop):</div>
                  <div className="text-xl font-bold">${exitStopFee.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="targets" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Label htmlFor="targetPrice1">Target 1 Price ($)</Label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        id="targetPrice1"
                        type="number"
                        value={targetPrice1}
                        onChange={(e) => setTargetPrice1(parseFloat(e.target.value) || 0)}
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={calculateTarget1to1}
                        className="whitespace-nowrap"
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Set 1:1 Target
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="targetPrice2">Target 2 Price ($)</Label>
                  <Input 
                    id="targetPrice2"
                    type="number"
                    value={targetPrice2}
                    onChange={(e) => setTargetPrice2(parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="targetPrice3">Target 3 Price ($)</Label>
                  <Input 
                    id="targetPrice3"
                    type="number"
                    value={targetPrice3}
                    onChange={(e) => setTargetPrice3(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-md">
                  <div className="text-sm font-medium text-foreground">Target 1 Stats:</div>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Profit:</span>
                      <span className="text-sm font-medium text-profit">${winAmount1.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Net Profit:</span>
                      <span className="text-sm font-medium text-profit">${netProfitLoss1.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">R:R Ratio:</span>
                      <span className="text-sm font-medium">{riskReward1}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">% Change:</span>
                      <span className="text-sm font-medium text-profit">{winPercentage1.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-muted rounded-md">
                  <div className="text-sm font-medium text-foreground">Target 2 Stats:</div>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Profit:</span>
                      <span className="text-sm font-medium text-profit">${winAmount2.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Net Profit:</span>
                      <span className="text-sm font-medium text-profit">${netProfitLoss2.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">R:R Ratio:</span>
                      <span className="text-sm font-medium">{riskReward2}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">% Change:</span>
                      <span className="text-sm font-medium text-profit">{winPercentage2.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-muted rounded-md">
                  <div className="text-sm font-medium text-foreground">Target 3 Stats:</div>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Profit:</span>
                      <span className="text-sm font-medium text-profit">${winAmount3.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Net Profit:</span>
                      <span className="text-sm font-medium text-profit">${netProfitLoss3.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">R:R Ratio:</span>
                      <span className="text-sm font-medium">{riskReward3}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">% Change:</span>
                      <span className="text-sm font-medium text-profit">{winPercentage3.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="results" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-md">
                  <div className="text-sm font-medium text-foreground">Win Scenario (Target 1):</div>
                  <div className="text-2xl font-bold text-profit">+${winAmount1.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">(+{winPercentage1.toFixed(2)}%)</div>
                </div>
                
                <div className="p-4 bg-muted rounded-md">
                  <div className="text-sm font-medium text-foreground">Loss Scenario:</div>
                  <div className="text-2xl font-bold text-loss">-${stopAmount.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">(-{stopPercentage.toFixed(2)}%)</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-md">
                  <div className="text-sm font-medium text-foreground">Risk/Reward Ratio (Target 1):</div>
                  <div className="text-2xl font-bold">{riskReward1}</div>
                  <div className="text-xs text-muted-foreground">
                    (Win Amount / Loss Amount)
                  </div>
                </div>
                
                <div className="p-4 bg-muted rounded-md">
                  <div className="text-sm font-medium text-foreground">Net Profit (after fees):</div>
                  <div className="text-2xl font-bold text-profit">
                    ${netProfitLoss1.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    (Win amount - Entry Fee - Exit Fee)
                  </div>
                </div>
                
                <div className={`p-4 rounded-md ${riskReward1 >= 2 ? 'bg-profit/20' : riskReward1 >= 1 ? 'bg-primary/20' : 'bg-loss/20'}`}>
                  <div className="text-sm font-medium text-foreground">Trade Quality:</div>
                  <div className={`text-xl font-bold ${riskReward1 >= 2 ? 'text-profit' : riskReward1 >= 1 ? 'text-primary' : 'text-loss'}`}>
                    {riskReward1 >= 2 ? 'Excellent' : riskReward1 >= 1 ? 'Good' : 'Poor'}
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
