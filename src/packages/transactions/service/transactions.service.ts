import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from '../model/transaction.schema';
import { Model } from 'mongoose';
import { CreateTransactionDTO } from '../dto/createTransaction.dto';
import { brazilTimeZone, mapStringToDate } from '../helpers/date.helpers';
import { TransactionsByDateDTO } from '../dto/transactionsByDate.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RecurringTransactionDTO } from '../dto/recurringTransaction.dto';
import { UpdateTransactionDTO } from '../dto/updateTransaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}

  async create(
    createTransactionDTO: CreateTransactionDTO,
  ): Promise<Transaction> {
    try {
      const createdTransaction = new this.transactionModel({
        ...createTransactionDTO,
        updatedAmount: createTransactionDTO.amount,
      });
      return await createdTransaction.save();
    } catch (e: any) {
      console.log(e);
      throw new HttpException(
        'Erro creating transaction. Try again later.',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async update(
    updateTransactionDTO: UpdateTransactionDTO,
  ): Promise<Transaction> {
    const { id, cascade, updateOriginal, ...data } = updateTransactionDTO;
    if (cascade) {
      const { title, description, type, recurring, user } =
        await this.transactionModel.findById(id);

      await this.transactionModel.updateMany(
        {
          title,
          description,
          type,
          recurring,
          user,
        },
        { ...data, updatedAmount: data.amount, updatedAt: brazilTimeZone() },
      );
    } else {
      if (updateOriginal) {
        const { title, description, type, recurring, user } =
          await this.transactionModel.findById(id);
        const originalTransaction = await this.transactionModel.findOne({
          description: description,
          recurring: recurring,
          title: title,
          type: type,
          user: user,
          original: true,
        });
        await this.transactionModel.findByIdAndUpdate(
          originalTransaction.id,
          {
            updatedAmount: data.amount,
            updatedAt: brazilTimeZone(),
          },
          { new: true },
        );
      }
      return await this.transactionModel.findByIdAndUpdate(id, {
        ...data,
        updatedAmount: data.amount,
        updatedAt: brazilTimeZone(),
      });
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

  async deleteTransaction(id: string): Promise<any> {
    return await this.transactionModel.findByIdAndDelete(id);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async addDailyRecurringTransaction() {
    const groups: RecurringTransactionDTO[] =
      await this.transactionModel.aggregate([
        /// Match field with filter
        {
          $match: {
            recurring: 'daily',
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
        {
          $project: {
            uniqueId: {
              $concat: [
                '$title',
                ' - ',
                '$description',
                ' - ',
                '$type',
                ' - ',
                '$user.username',
              ],
            },
            data: '$$ROOT',
          },
        },
        /// Returns new array with grouping. _id is the field. Push adds the corresponding document to new array. Root is the whole document.
        {
          $group: {
            _id: '$uniqueId',
            transactions: { $push: '$$ROOT' },
          },
        },
      ]);

    if (groups.length > 0) {
      groups.forEach(async (group) => {
        const transaction = group.transactions.filter(
          (transaction) => transaction.data.original,
        )[0].data;
        const createdTransaction = this.transactionModel.create({
          amount: transaction.updatedAmount,
          updatedAmount: transaction.updatedAmount,
          description: transaction.description,
          recurring: transaction.recurring,
          title: transaction.title,
          type: transaction.type,
          user: transaction.user,
          original: false,
        });
        (await createdTransaction).save();
      });
    }
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async addMonthlyRecurringTransaction() {
    const groups: RecurringTransactionDTO[] =
      await this.transactionModel.aggregate([
        /// Match field with filter
        {
          $match: {
            recurring: 'monthly',
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
        {
          $project: {
            uniqueId: {
              $concat: [
                '$title',
                ' - ',
                '$description',
                ' - ',
                '$type',
                ' - ',
                '$user.username',
              ],
            },
            data: '$$ROOT',
          },
        },
        /// Returns new array with grouping. _id is the field. Push adds the corresponding document to new array. Root is the whole document.
        {
          $group: {
            _id: '$uniqueId',
            transactions: { $push: '$$ROOT' },
          },
        },
      ]);

    if (groups.length > 0) {
      groups.forEach(async (group) => {
        const transaction = group.transactions.filter(
          (transaction) => transaction.data.original,
        )[0].data;
        const createdTransaction = this.transactionModel.create({
          amount: transaction.updatedAmount,
          updatedAmount: transaction.updatedAmount,
          description: transaction.description,
          recurring: transaction.recurring,
          title: transaction.title,
          type: transaction.type,
          user: transaction.user,
          original: false,
        });
        (await createdTransaction).save();
      });
    }
  }
}
