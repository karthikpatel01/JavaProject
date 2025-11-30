export type UserRole = 'CUSTOMER' | 'ADMIN' | null;

export interface Transaction {
  id: number;
  cardNumber: string;
  type: string;
  amount: number;
  timestamp: string;
  status: string;
  balanceAfter?: number;
}

export interface CardDetails {
  id: number;
  cardNumber: string;
  customerName: string;
  balance: number;
  pinHash: string;
}

export interface TransactionRequest {
  cardNumber: string;
  pin: string;
  amount: number;
  type: 'topup' | 'withdraw';
}

export interface TransactionResponse {
  success: boolean;
  message: string;
  balance?: number;
}