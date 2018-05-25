import { Global, Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

import { ConfigService } from './config.service';

const pubSubProvider = {
  // TODO move into separate file
  provide: 'PubSub',
  useValue: new PubSub(),
};

@Global()
@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(
        `${process.cwd()}/src/config/${process.env.NODE_ENV}/.env`,
      ),
    },
    pubSubProvider,
  ],
  exports: [ConfigService, 'PubSub'],
})
export class ConfigModule {}
