import { Inject, UseGuards } from '@nestjs/common';
import { Mutation, Query, ResolveProperty, Resolver, Subscription } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from 'comments/comments.service';
import { Roles } from 'common/decorators/role.decorator';
import { RolesGuard } from 'common/guards/roles.guard';
import { ApiQuery } from 'common/models/api-query.model';
import { PubSub } from 'graphql-subscriptions';
import { convertToMongoSortQuery } from 'utils/mongoSortQueryConverter';

import { ROLES } from '../constants';
import { BookService } from './book.service';

@Resolver('Book')
export class BooksResolvers {
  constructor(
    private readonly bookService: BookService,
    private readonly commentService: CommentsService,
    @Inject('PubSub') private readonly pubSub: PubSub,
  ) {}

  @Query('books')
  @UseGuards(AuthGuard('jwt'))
  async getBooks(obj, { filter, skip, first, orderBy }, context, info) {
    const order = (orderBy && convertToMongoSortQuery(orderBy)) || null;
    return await this.bookService.findAll(
      new ApiQuery(
        filter && { [filter.field]: new RegExp(`^${filter.search}`, 'i') },
        first,
        skip,
        order,
      ),
    );
  }

  @Query('book')
  @UseGuards(AuthGuard('jwt'))
  async getBook(obj, { slug }, context, info) {
    return await this.bookService.findBySlug(slug);
  }

  @ResolveProperty('comments')
  async getComments({ id }, args, context, info) {
    return await this.commentService.getAllForBook(id);
  }

  @Mutation()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLES.ADMIN)
  async createBook(obj, { book }, context, info) {
    return await this.bookService.create(book);
  }

  @Mutation()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLES.ADMIN)
  async updateBook(obj, { id, book }, context, info) {
    return await this.bookService.update(id, book);
  }

  @Mutation()
  @UseGuards(AuthGuard('jwt'))
  async rateBook(obj, { id, rate }, context, info) {
    const bookRate = await this.bookService.rateBook(id, rate);
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
