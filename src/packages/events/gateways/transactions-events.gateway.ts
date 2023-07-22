import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: 'transactions', cors: { origin: '*' } })
export class TransactionsEventsGateway {
  @WebSocketServer()
  server: Server;

  // @OnEvent('list.update', { async: true })
  @SubscribeMessage('listUpdated')
  handleEvent(@MessageBody() date: string): any {
    this.server.emit('updateList', date);
  }
}
