export type CreateTransactionDTO = {
  title: string;
  description?: string;
  amount: number;
  type: string;
  recurring?: boolean;
  user: string;
};
