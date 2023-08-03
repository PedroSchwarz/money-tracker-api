import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from '../service/transactions.service';
import {
  AuthGuard,
  AuthenticatedRequest,
} from 'src/packages/auth/guard/auth.guard';
import { CreateTransactionDTO } from '../dto/createTransaction.dto';
import { FindTransactionDTO } from '../dto/findTransactions.dto';
import { DeleteTransactionDTO } from '../dto/deleteTransaction.dto';
import { UpdateTransactionDTO } from '../dto/updateTransaction.dto';
import { TransactionsMessagingService } from 'src/packages/events/messaging/transactions-messaging.service';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private transactionsService: TransactionsService,
    private transactionsMessagingService: TransactionsMessagingService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/')
  getAllTransactions(@Query() query: FindTransactionDTO) {
    return this.transactionsService.findAndGroupAllByDate(query.date);
  }

  @UseGuards(AuthGuard)
  @Post('/')
  async createTransaction(
    @Request() req: AuthenticatedRequest,
    @Body() createTransactionDTO: CreateTransactionDTO,
  ) {
    const user = req.user;
    const transaction = await this.transactionsService.create({
      ...createTransactionDTO,
      user: user.sub,
    });
    this.transactionsMessagingService.sendMessage({
      title: 'Transaction Added',
      from: user.username,
      action: 'added',
      amount: createTransactionDTO.amount.toString(),
      item: createTransactionDTO.type,
    });
    return transaction;
  }

  @UseGuards(AuthGuard)
  @Put('/')
  async updateTransaction(
    @Request() req: AuthenticatedRequest,
    @Body() updateTransactionDTO: UpdateTransactionDTO,
  ) {
    const transaction = await this.transactionsService.update(
      updateTransactionDTO,
    );
    if (transaction) {
      this.transactionsMessagingService.sendMessage({
        title: 'Transaction Updated',
        from: req.user.username,
        action: 'updated',
        amount: updateTransactionDTO.amount.toString(),
        previousAmount: transaction.amount.toString(),
        previousTransaction: transaction.title,
        item: updateTransactionDTO.type ?? transaction.type,
        changedOriginal: updateTransactionDTO.updateOriginal,
      });
    }
    return transaction;
  }

  @UseGuards(AuthGuard)
  @Get('/total')
  getTotalAmount() {
    return this.transactionsService.getAmountSum();
  }

  @UseGuards(AuthGuard)
  @Get('/total/date')
  getTotalAmountByDate(@Query() query: FindTransactionDTO) {
    return this.transactionsService.getAmountSumByDate(query.date);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  deleteTransaction(@Param() params: DeleteTransactionDTO) {
    return this.transactionsService.deleteTransaction(params.id);
  }

  @UseGuards(AuthGuard)
  @Get('/dates')
  getTransactionsDates() {
    return this.transactionsService.getTransactionsDates();
  }
}
