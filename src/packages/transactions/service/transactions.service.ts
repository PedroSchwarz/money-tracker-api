import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from '../model/transaction.schema';
import { Model } from 'mongoose';
import { CreateTransactionDTO } from '../dto/createTransaction.dto';

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
      return {
        statusCode: 500,
        message: "Couldn't create user",
      };
    }
  }

  async findAll(): Promise<Transaction[]> {
    return await this.transactionModel.find();
  }
}
