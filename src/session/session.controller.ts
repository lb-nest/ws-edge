import { Body, Controller, Param, Post } from '@nestjs/common';
import { SessionService } from './session.service';

@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post(':id/messages')
  async send(@Param('id') id: string, @Body() message: any) {
    try {
      return await this.sessionService.sendMessage(id, message);
    } catch {}
  }
}
