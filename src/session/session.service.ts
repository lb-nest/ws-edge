import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';
import { nanoid } from 'nanoid';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';

@Injectable()
export class SessionService {
  private readonly emitter = new EventEmitter();
  private readonly sockets = new WeakMap<Socket, [string, Socket['emit']]>();

  constructor(private readonly httpService: HttpService) {
    this.emitter.setMaxListeners(Infinity);
  }

  handleConnection(socket: Socket): void {
    // this.sockets.set(socket, ['', socket.emit.bind(socket)]);
  }

  handleDisconnect(socket: Socket): void {
    this.emitter.off(...this.sockets.get(socket));
    this.sockets.delete(socket);
  }

  handleSessionRequest(socket: Socket, message: any): void {
    const sessionId = message.session_id ?? nanoid();

    this.sockets.set(socket, [sessionId, socket.emit.bind(socket)]);
    this.emitter.on(...this.sockets.get(socket));

    socket.emit('session_confirm', sessionId);
  }

  handleMessage(socket: Socket, message: any): Observable<any> {
    return this.httpService.post(
      `/channels/${socket.handshake.query.channelId}/webhook`,
      message,
    );
  }

  sendMessage(sessionId: string, message: any): any {
    this.emitter.emit(sessionId, 'bot_uttered', message);
    return {
      message_id: nanoid(),
      ...message,
    };
  }
}
