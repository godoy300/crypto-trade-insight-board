
import { Trade } from '../types/trade';

// Constants for fees as described in the spreadsheet
const MAKER_FEE = 0.0002; // 0.02%
const TAKER_FEE = 0.0006; // 0.06%

// Lista de corretoras para dados de exemplo
const brokers = ['Binance', 'FTX', 'Bybit', 'Kraken', 'Coinbase Pro'];

// Function to calculate sample trade data
const generateSampleTrades = (count: number): Trade[] => {
  const trades: Trade[] = [];
  const pairs = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT', 'XRP/USDT'];
  
  // Generate a date 90 days ago
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 90);
  
  for (let i = 1; i <= count; i++) {
    // Randomly determine trade properties
    const type: 'LONG' | 'SHORT' = Math.random() > 0.5 ? 'LONG' : 'SHORT';
    const margin = parseFloat((1000 + Math.random() * 9000).toFixed(2));
    const leverage = Math.ceil(Math.random() * 10);
    const entryPrice = parseFloat((10000 + Math.random() * 40000).toFixed(2));
    const priceChangePercent = parseFloat((Math.random() * 0.1).toFixed(4)); // Up to 10% price change
    
    // For LONG trades, if result is WIN, exitPrice > entryPrice, otherwise exitPrice < entryPrice
    // For SHORT trades, if result is WIN, exitPrice < entryPrice, otherwise exitPrice > entryPrice
    const isWin = Math.random() > 0.4; // 60% win rate
    let exitPrice;
    
    if (type === 'LONG') {
      exitPrice = isWin 
        ? parseFloat((entryPrice * (1 + priceChangePercent)).toFixed(2))
        : parseFloat((entryPrice * (1 - priceChangePercent)).toFixed(2));
    } else {
      exitPrice = isWin
        ? parseFloat((entryPrice * (1 - priceChangePercent)).toFixed(2))
        : parseFloat((entryPrice * (1 + priceChangePercent)).toFixed(2));
    }
    
    const orderType: 'MAKER' | 'TAKER' = Math.random() > 0.5 ? 'MAKER' : 'TAKER';
    const result: 'WIN' | 'LOSS' = isWin ? 'WIN' : 'LOSS';
    
    // Calculate random date within the past 90 days
    const tradeDate = new Date(startDate);
    tradeDate.setDate(startDate.getDate() + Math.floor(Math.random() * 90));
    
    // Calculate fees based on the spreadsheet formulas
    let entryFee;
    if (type === 'LONG') {
      entryFee = orderType === 'TAKER' 
        ? margin * leverage * TAKER_FEE 
        : margin * leverage * MAKER_FEE;
    } else {
      entryFee = orderType === 'TAKER'
        ? margin * leverage * MAKER_FEE
        : margin * leverage * TAKER_FEE;
    }
    
    // Calculate win percentage
    const winPercentage = type === 'LONG'
      ? (exitPrice - entryPrice) / entryPrice
      : Math.abs((exitPrice - entryPrice) / entryPrice);
    
    // Calculate stop percentage (random for sample data)
    const stopPercentage = parseFloat((Math.random() * 0.05).toFixed(4)); // Up to 5% stop
    
    // Calculate exit fee using the formula from the spreadsheet
    const resultWithOrderType = `${result}/${orderType}`;
    let exitFee;
    
    if (resultWithOrderType === 'LOSS/MAKER') {
      exitFee = margin * leverage * MAKER_FEE;
    } else if (resultWithOrderType === 'LOSS/TAKER') {
      exitFee = margin * leverage * TAKER_FEE;
    } else if (resultWithOrderType === 'WIN/MAKER') {
      exitFee = ((winPercentage * leverage * margin) + (margin * leverage)) * MAKER_FEE;
    } else { // WIN/TAKER
      exitFee = ((winPercentage * leverage * margin) + (margin * leverage)) * TAKER_FEE;
    }
    
    // Normalized fees by margin
    const entryFeeNormalized = entryFee / margin;
    const exitFeeNormalized = exitFee / margin;
    
    // Operation cost (sum of normalized fees)
    const operationCost = entryFeeNormalized + exitFeeNormalized;
    
    // Random pair
    const pair = pairs[Math.floor(Math.random() * pairs.length)];
    
    // Random broker
    const broker = brokers[Math.floor(Math.random() * brokers.length)];
    
    trades.push({
      id: i,
      type,
      margin,
      leverage,
      entryPrice,
      exitPrice,
      orderType,
      entryFee,
      stopPercentage,
      winPercentage,
      result,
      resultWithOrderType,
      exitFee,
      exitFeeNormalized,
      entryFeeNormalized,
      operationCost,
      date: tradeDate.toISOString(),
      pair,
      broker
    });
  }
  
  return trades;
};

// Generate 50 sample trades
export const sampleTradeData = generateSampleTrades(50);

// Helper functions to calculate metrics from trade data
export const calculateMetrics = (trades: Trade[]) => {
  const totalTrades = trades.length;
  const winTrades = trades.filter(trade => trade.result === 'WIN').length;
  const winRate = totalTrades > 0 ? (winTrades / totalTrades * 100) : 0;
  
  const totalProfit = trades.reduce((acc, trade) => {
    const profitLoss = trade.result === 'WIN' 
      ? trade.margin * trade.leverage * trade.winPercentage - trade.entryFee - trade.exitFee
      : -trade.margin * trade.leverage * trade.stopPercentage - trade.entryFee - trade.exitFee;
    return acc + profitLoss;
  }, 0);
  
  const averageOperationCost = trades.reduce((acc, trade) => acc + trade.operationCost, 0) / totalTrades;
  
  const makerTrades = trades.filter(trade => trade.orderType === 'MAKER').length;
  const takerTrades = trades.filter(trade => trade.orderType === 'TAKER').length;
  
  const longTrades = trades.filter(trade => trade.type === 'LONG').length;
  const shortTrades = trades.filter(trade => trade.type === 'SHORT').length;
  
  const averageLeverage = trades.reduce((acc, trade) => acc + trade.leverage, 0) / totalTrades;
  
  // Calcular a média de risco/retorno
  const riskRewardRatios = trades
    .filter(trade => trade.stopPercentage > 0)
    .map(trade => trade.winPercentage / trade.stopPercentage);
  
  const averageRiskReward = riskRewardRatios.length > 0
    ? riskRewardRatios.reduce((acc, ratio) => acc + ratio, 0) / riskRewardRatios.length
    : 0;
  
  return {
    totalTrades,
    winTrades,
    winRate: winRate.toFixed(2),
    totalProfit: totalProfit.toFixed(2),
    averageOperationCost: averageOperationCost.toFixed(4),
    makerTrades,
    takerTrades,
    longTrades,
    shortTrades,
    averageLeverage: averageLeverage.toFixed(1),
    averageRiskReward: averageRiskReward.toFixed(2)
  };
};
