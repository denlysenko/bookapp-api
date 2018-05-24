import { UseGuards } from '@nestjs/common';
import { Mutation, Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from 'comments/comments.service';
import { ApiQuery } from 'common/models/api-query.model';
import { convertToMongoSortQuery } from 'utils/mongoSortQueryConverter';

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
    const { id } = args;
    return await this.bookService.findById(id);
  }

  @ResolveProperty('comments')
  async getComments(book, args, context, info) {
    const { id } = book;
    return this.commentService.getAllForBook(id);
  }

  @Mutation('createBook')
  async createBook(obj, args, context, info) {
    const { book } = args;
    return await this.bookService.create(book);
  }
}
