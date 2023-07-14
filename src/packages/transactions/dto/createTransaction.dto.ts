import { Date } from 'mongoose';

export type CreateTransactionDTO = {
  title: string;
  description?: string;
  amount: number;
  type: string;
  recurring?: boolean;
  user: string;
  updatedAt?: Date;
};
