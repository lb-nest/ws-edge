import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SessionModule } from './session/session.module';

@Module({
  imports: [ConfigModule.forRoot(), SessionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
