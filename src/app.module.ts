import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { AppGateway } from './app.gateway';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: path.resolve('public'),
    }),
  ],
  providers: [AppGateway, AppService],
})
export class AppModule {}
