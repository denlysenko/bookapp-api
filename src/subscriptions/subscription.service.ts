import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { execute, subscribe } from 'graphql';
import { ServerOptions, SubscriptionServer } from 'subscriptions-transport-ws';
import * as WebSocket from 'ws';

@Injectable()
export class SubscriptionService implements OnModuleDestroy {
  private subscriptionServer: SubscriptionServer;

  constructor(@Inject('SUBSCRIPTIONS_SERVER') private readonly ws) {}

  createServer(
    schema: any,
    options: ServerOptions = {},
    socketOptions: WebSocket.ServerOptions = {},
  ) {
    this.subscriptionServer = new SubscriptionServer(
      { execute, subscribe, schema, ...options },
      {
        server: this.ws,
        path: '/subscriptions',
        ...socketOptions,
      },
    );
  }

  onModuleDestroy() {
    this.ws.close();
  }
}
