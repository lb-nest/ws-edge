import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { SessionModule } from './session/session.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        PORT: Joi.number().default(8080),
        SECRET: Joi.string().required(),
        MESSAGING_URL: Joi.string().uri().required(),
      }),
    }),
    SessionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
