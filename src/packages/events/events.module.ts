import { Module } from '@nestjs/common';
import { TransactionsEventsGateway } from './gateways/transactions-events.gateway';

@Module({
  providers: [TransactionsEventsGateway],
})
export class EventsModule {}
