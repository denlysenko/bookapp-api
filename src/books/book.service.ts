import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiQuery } from 'common/models/api-query.model';
import { ApiResponse } from 'common/models/api-response.model';
import { ConfigService } from 'config/config.service';
import * as _ from 'lodash';
import { Model } from 'mongoose';

import { BookDto } from './dto/book.dto';
import { Book } from './interfaces/book.interface';

@Injectable()
export class BookService {
  constructor(
    @InjectModel('Book') private readonly bookModel: Model<Book>,
    private readonly configService: ConfigService,
  ) {}

  async findAll(query?: ApiQuery): Promise<ApiResponse<Book>> {
    const where = query.filter || {};
    const count = await this.bookModel.count(where);
    const rows = await this.bookModel
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

  async findById(id: string): Promise<Book> {
    return await this.bookModel.findById(id).exec();
  }

  async create(book: BookDto): Promise<Book> {
    const newBook = new this.bookModel(book);
    return await newBook.save();
  }

  async update(slug: string, book: BookDto): Promise<Book> {
    const updatingBook = this.bookModel.findOne({ slug }).exec();
    _.extend(updatingBook, book);
    return await updatingBook.save();
  }
}
