
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
  broker?: string; // Nova propriedade para a corretora
}

export interface TradeFilters {
  tradeType: TradeType | 'ALL';
  orderType: OrderType | 'ALL';
  startDate: string | null;
  endDate: string | null;
  broker?: string | 'ALL'; // Nova propriedade para filtrar por corretora
}
