import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from 'config/config.module';
import { SubscriptionModule } from 'subscriptions/subscription.module';

@Module({
  imports: [
    GraphQLModule,
    SubscriptionModule.forRoot(),
    MongooseModule.forRoot(process.env.OPENSHIFT_DB_URL),
    ConfigModule,
  ],
  exports: [GraphQLModule, SubscriptionModule],
})
export class CoreModule {}
