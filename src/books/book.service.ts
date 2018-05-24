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

  async findBySlug(slug: string): Promise<Book> {
    return await this.bookModel
      .findOneAndUpdate({ slug }, { $inc: { views: 1 } })
      .exec();
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

  // TODO add subscriptions
  async rateBook(id: string, newRate: number): Promise<Book> {
    const book = await this.bookModel.findById(id).exec();
    const total_rates = book.total_rates + 1;
    const total_rating = book.total_rating + newRate;
    const rating = Math.ceil(total_rating / total_rates);
    book.total_rates = total_rates;
    book.total_rating = total_rating;
    book.rating = rating;
    return book.save();
  }
}
