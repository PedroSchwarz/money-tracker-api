import { Transaction } from '../model/transaction.schema';

export type RecurringTransactionDTO = {
  _id: string;
  transactions: {
    uniqueId: string;
    data: Transaction;
  }[];
};
