export type UpdateTransactionDTO = {
  id: string;
  title: string;
  description: string;
  amount: number;
  type: string;
  recurring: string;
  cascade: boolean;
  updateOriginal: boolean;
};
