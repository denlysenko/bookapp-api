import { PubSub } from 'graphql-subscriptions';

import { PUB_SUB } from '../../constants';

export const pubSubProvider = {
  provide: PUB_SUB,
  useValue: new PubSub(),
};
