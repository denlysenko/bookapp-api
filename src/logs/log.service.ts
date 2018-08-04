import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiQuery } from 'common/models/api-query.model';
import { ApiResponse } from 'common/models/api-response.model';
import { ConfigService } from 'config/config.service';
import { PubSub } from 'graphql-subscriptions';
import { Model } from 'mongoose';

import { PUB_SUB } from '../constants';
import { LogDto } from './dto/log.dto';
import { Log } from './interfaces/log.interface';

@Injectable()
export class LogService {
  constructor(
    @InjectModel('Log') private readonly logModel: Model<Log>,
    private readonly configService: ConfigService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async create(logDto: LogDto): Promise<Log> {
    const createdLog = new this.logModel(logDto);
    await createdLog.save();
    this.pubSub.publish('logCreated', { logCreated: createdLog });
    return createdLog;
  }

  async findAll(query?: ApiQuery): Promise<ApiResponse<Log>> {
    const where = query.filter || {};
    const count = await this.logModel.countDocuments(where);
    const rows = await this.logModel
      .find(where)
      .skip(query.skip || 0)
      .limit(query.first || Number(this.configService.get('DEFAULT_LIMIT')))
      .sort(query.order)
      .exec();

    return {
      count,
      rows,
    };
  }
}
