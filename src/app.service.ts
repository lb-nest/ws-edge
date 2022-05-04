import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Socket } from 'socket.io';
import * as uuid from 'uuid';

@Injectable()
export class AppService {
  private readonly messagingUrl: string;
  private readonly clients: Record<string, Socket> = {};

  constructor(consigService: ConfigService) {
    this.messagingUrl = consigService.get<string>('MESSAGING_URL');
  }

  async handleSessionRequest(client: Socket, message: any): Promise<any> {
    const sessionId = message.session_id ?? uuid.v4();
    this.clients[sessionId] = client;
    client.emit('session_confirm', sessionId);
  }

  async handleDisconnect(client: Socket): Promise<void> {
    const [key] = Object.entries(this.clients).find(
      ([, socket]) => socket.id === client.id,
    );

    delete this.clients[key];
  }

  async handleMessage(client: Socket, message: any): Promise<void> {
    try {
      const id = client.handshake.query.channelId;
      await axios.post(
        this.messagingUrl.concat(`/channels/${id}/webhook`),
        message,
      );
    } catch {}
  }

  async sendMessage(sessionId: string, message: any): Promise<any> {
    const client = this.clients[sessionId];
    if (client) {
      client.emit('bot_uttered', message);
    }

    return {
      message_id: uuid.v4(),
      ...message,
    };
  }
}
