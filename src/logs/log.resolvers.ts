import { Inject, UseGuards } from '@nestjs/common';
import { Query, ResolveProperty, Resolver, Subscription } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { ApiQuery } from 'common/models/api-query.model';
import { PubSub } from 'graphql-subscriptions';
import { convertToMongoSortQuery } from 'utils/mongoSortQueryConverter';

import { PUB_SUB } from '../constants';
import { LogService } from './log.service';

@Resolver('Log')
export class LogResolver {
  constructor(
    private readonly logService: LogService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Query('logs')
  @UseGuards(AuthGuard('jwt'))
  async getLogs(_, { skip, first, orderBy }, __, info) {
    const userId = info.rootValue.user._id;
    const order = (orderBy && convertToMongoSortQuery(orderBy)) || null;
    return await this.logService.findAll(
      new ApiQuery({ userId }, first, skip, order),
    );
  }

  @Subscription()
  logCreated() {
    return {
      subscribe: () => this.pubSub.asyncIterator('logCreated'),
    };
  }

  @ResolveProperty('book')
  async getBook({ bookId }, _, { loaders }) {
    return await loaders.booksLoader.load(bookId);
  }
}
