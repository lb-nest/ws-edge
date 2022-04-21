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
    this.messagingUrl = consigService.get<string>('MESAGING_URL');
  }

  async handleConnect(client: Socket, message: any) {
    const sessionId = message.session_id ?? uuid.v4();
    this.clients[sessionId] = client;
    client.emit('session_confirm', sessionId);
  }

  async handleMessage(client: Socket, message: any) {
    try {
      await axios.post(
        this.messagingUrl.concat(
          `/channels/${client.handshake.query.channelId}/webhook`,
        ),
        message,
      );
    } catch {}
  }

  async sendMessage(clientId: string, message: any) {
    const client = this.clients[clientId];
    if (client) {
      client.emit('bot_uttered', message, () => {
        console.log(1);
      });
    }
  }
}
