import { Module } from '@nestjs/common';
import { TransactionsEventsGateway } from './gateways/transactions-events.gateway';
import { TransactionsMessagingService } from './messaging/transactions-messaging.service';

@Module({
  providers: [TransactionsEventsGateway, TransactionsMessagingService],
  exports: [TransactionsMessagingService],
})
export class EventsModule {}
