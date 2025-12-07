export interface WaterLog {
  id: string;
  amount: number; // in ml
  timestamp: number;
  txHash?: string; // Blockchain transaction hash
  dateStr: string; // YYYY-MM-DD for easy grouping
}

export interface DailyStat {
  date: string;
  totalAmount: number;
}

export interface WalletState {
  address: string | null;
  chainId: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}