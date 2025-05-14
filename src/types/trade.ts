
export type TradeType = 'LONG' | 'SHORT';
export type OrderType = 'MAKER' | 'TAKER';
export type ResultType = 'WIN' | 'LOSS';

export interface Trade {
  id: number;
  type: TradeType;
  margin: number;
  leverage: number;
  entryPrice: number;
  exitPrice: number;
  orderType: OrderType;
  entryFee: number;
  stopPercentage: number;
  winPercentage: number;
  result: ResultType;
  resultWithOrderType: string; // e.g. "WIN/MAKER", "LOSS/TAKER"
  exitFee: number;
  exitFeeNormalized: number;
  entryFeeNormalized: number;
  operationCost: number;
  date: string;  // ISO date string
  pair: string;  // e.g. "BTC/USDT"
  broker?: string; // Broker property
  setup?: string; // New property for setup type
  profitability?: number; // New property for profitability
}

export interface TradeFilters {
  tradeType: TradeType | 'ALL';
  orderType: OrderType | 'ALL';
  startDate: string | null;
  endDate: string | null;
  broker?: string | 'ALL';
  setup?: string | 'ALL'; // New filter for setup
}

export interface Goal {
  id: string;
  type: 'daily' | 'weekly' | 'quarterly' | 'semiannual' | 'annual';
  category: 'income' | 'bankGrowth';
  target: number;
  current: number;
  startDate: string;
  endDate: string;
}
