import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiQuery } from 'common/models/api-query.model';
import { ApiResponse } from 'common/models/api-response.model';
import { ConfigService } from 'config/config.service';
import { LogDto } from 'logs/dto/log.dto';
import { LogService } from 'logs/log.service';
import { Model } from 'mongoose';

import { BOOKMARK_ERRORS, BOOKMARKS, USER_ACTIONS } from '../constants';
import { Bookmark } from './interfaces/bookmark.interface';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectModel('Bookmark') private readonly bookmarkModel: Model<Bookmark>,
    private readonly configService: ConfigService,
    private readonly logService: LogService,
  ) {}

  async getByType(query?: ApiQuery): Promise<ApiResponse<Bookmark>> {
    const where = query.filter || {};
    const count = await this.bookmarkModel.countDocuments(where);
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

  getByUserAndBook(userId: string, bookId: string): Promise<Bookmark[]> {
    return this.bookmarkModel.find({ userId, bookId }).exec();
  }

  async addToBookmarks(
    type: string,
    userId: string,
    bookId: string,
  ): Promise<Bookmark> {
    const bookmark = await this.bookmarkModel.findOne({ type, bookId, userId });
    if (bookmark) {
      throw new BadRequestException(BOOKMARK_ERRORS.BOOKMARK_UNIQUE_ERR);
    }
    // BOOK_ADDED_TO_MUSTREAD
    const newBookmark = new this.bookmarkModel({ type, userId, bookId });
    await newBookmark.save();
    await this.logService.create(
      new LogDto(
        userId,
        USER_ACTIONS[`BOOK_ADDED_TO_${BOOKMARKS[type]}`],
        bookId,
      ),
    );
    return newBookmark;
  }

  async removeFromBookmarks(type: string, userId: string, bookId: string) {
    const bookmark = await this.bookmarkModel.findOne({ type, bookId, userId });
    if (!bookmark) {
      throw new BadRequestException(BOOKMARK_ERRORS.BOOKMARK_NOT_FOUND_ERR);
    }

    // BOOK_REMOVED_FROM_MUSTREAD
    await bookmark.remove();
    await this.logService.create(
      new LogDto(
        userId,
        USER_ACTIONS[`BOOK_REMOVED_FROM_${BOOKMARKS[type]}`],
        bookId,
      ),
    );
    return bookmark;
  }
}
