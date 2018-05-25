import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiQuery } from 'common/models/api-query.model';
import { ApiResponse } from 'common/models/api-response.model';
import { ConfigService } from 'config/config.service';
import { Model } from 'mongoose';

import { BOOKMARK_ERRORS } from '../constants';
import { Bookmark } from './interfaces/bookmark.interface';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectModel('Bookmark') private readonly bookmarkModel: Model<Bookmark>,
    private readonly configService: ConfigService,
  ) {}

  async getByType(query?: ApiQuery): Promise<ApiResponse<Bookmark>> {
    const where = query.filter || {};
    const count = await this.bookmarkModel.count(where);
    const rows = await this.bookmarkModel
      .find(where)
      .skip(query.skip || 0)
      .limit(query.first || Number(this.configService.get('DEFAULT_LIMIT')))
      .exec();

    return {
      count,
      rows,
    };
  }

  async addToBookmarks(
    type: number,
    userId: string,
    bookId: string,
  ): Promise<Bookmark> {
    const bookmark = await this.bookmarkModel.findOne({ type, bookId, userId });
    if (bookmark) {
      throw new BadRequestException(BOOKMARK_ERRORS.BOOKMARK_UNIQUE_ERR);
    }

    const newBookmark = new this.bookmarkModel({ type, userId, bookId });
    return await newBookmark.save();
  }

  async removeFromBookmarks(type: number, userId: string, bookId: string) {
    const bookmark = await this.bookmarkModel.findOne({ type, bookId, userId });
    if (!bookmark) {
      throw new BadRequestException(BOOKMARK_ERRORS.BOOKMARK_NOT_FOUND_ERR);
    }

    await bookmark.remove();
    return bookmark;
  }
}
