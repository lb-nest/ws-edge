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

  async handleConnection(client: Socket, message: any) {
    const sessionId = message.session_id ?? uuid.v4();
    this.clients[sessionId] = client;
    client.emit('session_confirm', sessionId);
  }

  async handleDisconnect(client: Socket) {
    const [key] = Object.entries(this.clients).find(
      ([, socket]) => socket.id === client.id,
    );

    delete this.clients[key];
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

  async sendMessage(sessionId: string, message: any) {
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
