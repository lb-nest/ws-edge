import { Body, Controller, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('sessions/:id/messages')
  async send(@Param('id') id: string, @Body() message: any) {
    try {
      return await this.appService.sendMessage(id, message);
    } catch (e) {
      console.error(e);
    }
  }
}
