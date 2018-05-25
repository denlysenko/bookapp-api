import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from 'config/config.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { SubscriptionModule } from 'subscriptions/subscription.module';

dotenv.config({
  path: path.resolve(
    process.cwd(),
    `./src/config/${process.env.NODE_ENV}/.env`,
  ),
});

@Module({
  imports: [
    GraphQLModule,
    SubscriptionModule.forRoot(),
    MongooseModule.forRoot(`mongodb://mongodb`, {
      user: process.env.DB_USER,
      pass: process.env.DB_PASSWORD,
      dbName: process.env.DB_NAME,
    }),
    ConfigModule,
  ],
  exports: [GraphQLModule, SubscriptionModule],
})
export class CoreModule {}
