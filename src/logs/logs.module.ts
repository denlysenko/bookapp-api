import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { pubSubProvider } from 'core/providers/pubSub.provider';

import { LogResolver } from './log.resolvers';
import { LogService } from './log.service';
import { LogSchema } from './schemas/log.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Log', schema: LogSchema }])],
  providers: [LogService, LogResolver, pubSubProvider],
  exports: [LogService],
})
export class LogsModule {}
