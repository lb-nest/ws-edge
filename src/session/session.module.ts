import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SessionController } from './session.controller';
import { SessionGateway } from './session.gateway';
import { SessionService } from './session.service';

@Module({
  imports: [ConfigModule],
  controllers: [SessionController],
  providers: [SessionService, SessionGateway],
})
export class SessionModule {}
