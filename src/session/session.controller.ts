import { Body, Controller, Param, Post } from '@nestjs/common';
import { SessionService } from './session.service';

@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post(':id/messages')
  send(@Param('id') id: string, @Body() message: any): any {
    return this.sessionService.sendMessage(id, message);
  }
}
