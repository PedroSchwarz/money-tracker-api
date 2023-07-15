import {
  Body,
  Controller,
  Get,
  Post,
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

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @UseGuards(AuthGuard)
  @Get('/')
  getAllTransactions(@Query() query: FindTransactionDTO) {
    return this.transactionsService.findAllByDate(query.date);
  }

  @UseGuards(AuthGuard)
  @Post('/')
  createTransactions(
    @Request() req: AuthenticatedRequest,
    @Body() createTransactionDTO: CreateTransactionDTO,
  ) {
    const user = req.user;
    return this.transactionsService.create({
      ...createTransactionDTO,
      user: user.sub,
    });
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
}
