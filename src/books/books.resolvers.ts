import { Inject, UseGuards } from '@nestjs/common';
import { Mutation, Query, ResolveProperty, Resolver, Subscription } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from 'comments/comments.service';
import { Roles } from 'common/decorators/role.decorator';
import { RolesGuard } from 'common/guards/roles.guard';
import { ApiQuery } from 'common/models/api-query.model';
import { PubSub } from 'graphql-subscriptions';
import { convertToMongoSortQuery } from 'utils/mongoSortQueryConverter';

import { PUB_SUB, ROLES } from '../constants';
import { BookService } from './book.service';

@Resolver('Book')
export class BooksResolvers {
  constructor(
    private readonly bookService: BookService,
    private readonly commentService: CommentsService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Query('books')
  @UseGuards(AuthGuard('jwt'))
  async getBooks(_, { paid, filter, skip, first, orderBy }) {
    const order = (orderBy && convertToMongoSortQuery(orderBy)) || null;
    let where = { paid };

    if (filter) {
      where = {
        ...where,
        [filter.field]: new RegExp(`${filter.search}`, 'i'),
      };
    }

    return await this.bookService.findAll(
      new ApiQuery(where, first, skip, order),
    );
  }

  @Query('bestBooks')
  @UseGuards(AuthGuard('jwt'))
  async getBestBooks(_, { skip, first }) {
    return await this.bookService.findBestBooks(
      new ApiQuery(null, first, skip),
    );
  }

  @Query('book')
  @UseGuards(AuthGuard('jwt'))
  async getBook(_, { slug }) {
    return await this.bookService.findBySlug(slug);
  }

  @ResolveProperty('comments')
  async getComments({ id }) {
    return await this.commentService.getAllForBook(id);
  }

  @Mutation()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLES.ADMIN)
  async createBook(_, { book }, __, info) {
    const userId = info.rootValue.user._id;
    return await this.bookService.create(book, userId);
  }

  @Mutation()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLES.ADMIN)
  async updateBook(_, { id, book }, __, info) {
    const userId = info.rootValue.user._id;
    return await this.bookService.update(id, book, userId);
  }

  @Mutation()
  @UseGuards(AuthGuard('jwt'))
  async rateBook(_, { id, rate }, __, info) {
    const userId = info.rootValue.user._id;
    const bookRate = await this.bookService.rateBook(id, rate, userId);
    this.pubSub.publish('bookRated', { bookRated: bookRate });
    return bookRate;
  }

  @Subscription()
  bookRated() {
    return {
      subscribe: () => this.pubSub.asyncIterator('bookRated'),
    };
  }
}
