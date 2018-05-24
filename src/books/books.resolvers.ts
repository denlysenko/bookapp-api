import { UseGuards } from '@nestjs/common';
import { Mutation, Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from 'comments/comments.service';
import { Roles } from 'common/decorators/role.decorator';
import { RolesGuard } from 'common/guards/roles.guard';
import { ApiQuery } from 'common/models/api-query.model';
import { convertToMongoSortQuery } from 'utils/mongoSortQueryConverter';

import { ROLES } from '../constants';
import { BookService } from './book.service';

@Resolver('Book')
export class BooksResolvers {
  constructor(
    private readonly bookService: BookService,
    private readonly commentService: CommentsService,
  ) {}

  @Query('books')
  @UseGuards(AuthGuard('jwt'))
  async getBooks(obj, args, context, info) {
    const { filter, skip, first, orderBy } = args;
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
  async getBook(obj, args, context, info) {
    const { slug } = args;
    return await this.bookService.findBySlug(slug);
  }

  @ResolveProperty('comments')
  async getComments(book, args, context, info) {
    const { id } = book;
    return await this.commentService.getAllForBook(id);
  }

  @Mutation()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLES.ADMIN)
  async createBook(obj, args, context, info) {
    const { book } = args;
    return await this.bookService.create(book);
  }

  @Mutation()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLES.ADMIN)
  async updateBook(obj, args, context, info) {
    const { id, book } = args;
    return await this.bookService.update(id, book);
  }

  @Mutation()
  @UseGuards(AuthGuard('jwt'))
  async rateBook(obj, args, context, info) {
    const { id, rate } = args;
    return await this.bookService.rateBook(id, rate);
  }
}
