export type CreateTransactionDTO = {
  title: string;
  description?: string;
  amount: number;
  type: string;
  recurring: string;
  user: string;
};
