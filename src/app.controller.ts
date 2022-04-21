import { Body, Controller, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post(':id/send')
  send(@Param('id') id: string, @Body() message: any) {
    this.appService.sendMessage(id, message);
  }
}
