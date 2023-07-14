import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from '../service/transactions.service';
import {
  AuthGuard,
  AuthenticatedRequest,
} from 'src/packages/auth/guard/auth.guard';
import { CreateTransactionDTO } from '../dto/createTransaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @UseGuards(AuthGuard)
  @Get('/')
  getAllTransactions() {
    return this.transactionsService.findAll();
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
}
