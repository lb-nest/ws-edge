import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SessionController } from './session.controller';
import { SessionGateway } from './session.gateway';
import { SessionService } from './session.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get<string>('MESSAGING_URL'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [SessionController],
  providers: [SessionService, SessionGateway],
})
export class SessionModule {}
