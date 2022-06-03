import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AppService } from './app.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway {
  constructor(private readonly appService: AppService) {}

  handleConnection(socket: Socket) {
    return this.appService.handleConnection(socket);
  }

  handleDisconnect(socket: Socket) {
    return this.appService.handleDisconnect(socket);
  }

  @SubscribeMessage('session_request')
  handleSessionRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: any,
  ) {
    return this.appService.handleSessionRequest(client, message);
  }

  @SubscribeMessage('user_uttered')
  handleMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: any,
  ) {
    return this.appService.handleMessage(client, message);
  }
}
