import { createServer } from 'http';

import { SUBSCRIPTIONS_SERVER } from '../constants';

export const createSubscriptionProviders = (port: number = 3002) => [
  {
    provide: SUBSCRIPTIONS_SERVER,
    useFactory: () => {
      const server = createServer();
      return new Promise(resolve => server.listen(port, () => resolve(server)));
    },
  },
];
