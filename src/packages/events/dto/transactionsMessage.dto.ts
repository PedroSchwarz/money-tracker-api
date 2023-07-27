export type TransactionsMessageDTO = {
  title: string;
  from: string;
  action: string;
  amount: string;
  item: string;
  previousTransaction?: string;
  previousAmount?: string;
  changedOriginal?: boolean;
};
