import { Injectable } from '@nestjs/common';
import admin from 'src/config/firebase-config';
import { TransactionsMessageDTO } from '../dto/transactionsMessage.dto';

@Injectable()
export class TransactionsMessagingService {
  private topic = 'transactions';

  sendMessage(messageDTO: TransactionsMessageDTO) {
    const isUpdate =
      messageDTO.previousAmount && messageDTO.previousTransaction;
    const amountDescription = isUpdate
      ? `from ${messageDTO.previousAmount} to ${messageDTO.amount}`
      : `in the value of ${messageDTO.amount}`;

    admin.messaging().send({
      topic: this.topic,
      notification: {
        title: messageDTO.title,
        body: `${messageDTO.from} ${messageDTO.action} ${
          messageDTO.previousTransaction ?? 'a'
        } transaction ${amountDescription} for ${messageDTO.item}. ${
          messageDTO.changedOriginal ?? false
            ? 'Next insertions of this transacation will contain the updated data.'
            : ''
        }`,
      },
    });
  }
}
