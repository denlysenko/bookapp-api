import { UseGuards } from '@nestjs/common';
import { Mutation, Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { BookService } from 'books/book.service';
import { ApiQuery } from 'common/models/api-query.model';
import * as DataLoader from 'dataloader';

import { BookmarkService } from './bookmark.service';

@Resolver('Bookmark')
export class BookmarkResolver {
  booksLoader: any;

  constructor(
    private readonly bookmarkService: BookmarkService,
    private readonly bookService: BookService,
  ) {
    this.booksLoader = new DataLoader((bookIds: string[]) => {
      const promises = bookIds.map(id => this.bookService.findById(id));
      return Promise.all(promises);
    });
  }

  @ResolveProperty('book')
  async getBook({ bookId }, args, context, info) {
    return await this.booksLoader.load(bookId);
  }

  @Query('bookmarks')
  @UseGuards(AuthGuard('jwt'))
  async getBookmarks(obj, { type, skip, first }, context, info) {
    const userId = info.rootValue.user._id;
    return await this.bookmarkService.getByType(
      new ApiQuery({ type, userId }, first, skip),
    );
  }

  @Mutation()
  @UseGuards(AuthGuard('jwt'))
  async addToBookmarks(obj, { type, bookId }, context, info) {
    const userId = info.rootValue.user._id;
    return await this.bookmarkService.addToBookmarks(type, userId, bookId);
  }

  @Mutation()
  @UseGuards(AuthGuard('jwt'))
  async removeFromBookmarks(obj, { type, bookId }, context, info) {
    const userId = info.rootValue.user._id;
    return await this.bookmarkService.removeFromBookmarks(type, userId, bookId);
  }
}
