import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { SessionService } from './session.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SessionGateway {
  constructor(private readonly sessionService: SessionService) {}

  handleConnection(socket: Socket): void {
    return this.sessionService.handleConnection(socket);
  }

  handleDisconnect(socket: Socket): void {
    return this.sessionService.handleDisconnect(socket);
  }

  @SubscribeMessage('session_request')
  handleSessionRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: any,
  ): void {
    return this.sessionService.handleSessionRequest(client, message);
  }

  @SubscribeMessage('user_uttered')
  handleMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: any,
  ): Observable<any> {
    return this.sessionService.handleMessage(client, message);
  }
}
