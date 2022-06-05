import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { EventEmitter } from 'events';
import { nanoid } from 'nanoid';
import { Socket } from 'socket.io';

@Injectable()
export class AppService {
  private readonly emitter = new EventEmitter();
  private readonly socket = new WeakMap<Socket, [string, Socket['emit']]>();

  private readonly axios: AxiosInstance;

  constructor(consigService: ConfigService) {
    this.axios = axios.create({
      baseURL: consigService.get<string>('MESSAGING_URL'),
    });

    this.emitter.setMaxListeners(Infinity);
  }

  handleConnection(socket: Socket): void {
    // this.socket.set(socket, ['', socket.emit.bind(socket)]);
  }

  handleDisconnect(socket: Socket): void {
    this.emitter.off(...this.socket.get(socket));
    this.socket.delete(socket);
  }

  handleSessionRequest(socket: Socket, message: any): any {
    const sessionId = message.session_id ?? nanoid();

    this.socket.set(socket, [sessionId, socket.emit.bind(socket)]);
    this.emitter.on(...this.socket.get(socket));

    socket.emit('session_confirm', sessionId);
  }

  sendMessage(sessionId: string, message: any): any {
    this.emitter.emit(sessionId, 'bot_uttered', message);
    return {
      message_id: nanoid(),
      ...message,
    };
  }

  handleMessage(socket: Socket, message: any): void {
    const id = socket.handshake.query.channelId;
    this.axios.post(`/channels/${id}/webhook`, message).catch(() => undefined);
  }
}
