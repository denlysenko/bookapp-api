import { Inject, UseGuards } from '@nestjs/common';
import { Query, Resolver, Subscription } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { ApiQuery } from 'common/models/api-query.model';
import { PubSub } from 'graphql-subscriptions';
import { convertToMongoSortQuery } from 'utils/mongoSortQueryConverter';

import { PUB_SUB } from '../constants';
import { LogService } from './log.service';

@Resolver()
export class LogResolver {
  constructor(
    private readonly logService: LogService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Query('logs')
  @UseGuards(AuthGuard('jwt'))
  async getLogs(obj, { skip, first, orderBy }, context, info) {
    const userId = info.rootValue.user._id;
    const order = (orderBy && convertToMongoSortQuery(orderBy)) || null;
    return await this.logService.findAll(
      new ApiQuery({ userId }, skip, first, order),
    );
  }

  @Subscription()
  logCreated() {
    return {
      subscribe: () => this.pubSub.asyncIterator('logCreated'),
    };
  }
}
