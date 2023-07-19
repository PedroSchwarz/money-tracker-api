import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from '../model/transaction.schema';
import { Model } from 'mongoose';
import { CreateTransactionDTO } from '../dto/createTransaction.dto';
import { mapStringToDate } from '../helpers/date.helpers';
import { TransactionsByDateDTO } from '../dto/transactionsByDate.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}

  async create(createTransactionDTO: CreateTransactionDTO): Promise<any> {
    try {
      const createdTransaction = new this.transactionModel(
        createTransactionDTO,
      );
      return await createdTransaction.save();
    } catch (e: any) {
      throw new HttpException(
        'Erro creating transaction. Try again later.',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async findAllByDate(from: string): Promise<TransactionsByDateDTO> {
    const transactions = await this.transactionModel
      .find({
        createdAt: {
          $gte: mapStringToDate(from),
          $lt: mapStringToDate(from, true),
        },
      })
      .sort({ createdAt: 1 })
      .populate('user')
      .exec();

    return { data: transactions };
  }

  async findAndGroupAllByDate(from: string): Promise<any> {
    const transactions = await this.transactionModel.aggregate([
      /// Match field with filter
      {
        $match: {
          createdAt: {
            $gte: mapStringToDate(from),
            $lt: mapStringToDate(from, true),
          },
        },
      },
      /// Populate document field with users table matching local and foreign fields
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      /// Lookup returns an array. Unwind returns one element
      { $unwind: '$user' },
      /// Returns new array with grouping. _id is the field. Push adds the corresponding document to new array. Root is the whole document.
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          transactions: { $push: '$$ROOT' },
        },
      },
      { $sort: { total: 1 } },
    ]);

    return { data: transactions };
  }

  async getAmountSumByDate(from: string): Promise<any> {
    const results = await this.transactionModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: mapStringToDate(from),
            $lt: mapStringToDate(from, true),
          },
        },
      },
      { $group: { _id: null, amount: { $sum: '$amount' } } },
    ]);
    return results.at(0) ?? { amount: 0 };
  }

  async getAmountSum(): Promise<any> {
    const results = await this.transactionModel.aggregate([
      { $group: { _id: null, amount: { $sum: '$amount' } } },
    ]);
    return results.at(0) ?? { amount: 0 };
  }

  async fetchAllRecurringTransactions(type: string): Promise<any> {
    const transactions = await this.transactionModel.find({
      recurring: type,
    });
    return { data: transactions };
  }

  async deleteTransaction(id: string): Promise<any> {
    return await this.transactionModel.findByIdAndDelete(id);
  }
}
