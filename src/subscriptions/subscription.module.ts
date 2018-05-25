import { DynamicModule, Module } from '@nestjs/common';

import { createSubscriptionProviders } from './subscription.providers';
import { SubscriptionService } from './subscription.service';

@Module({
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {
  static forRoot(port: number = 3002): DynamicModule {
    const providers = createSubscriptionProviders(port);
    return {
      module: SubscriptionModule,
      providers: [...providers],
      exports: [...providers],
    };
  }
}
