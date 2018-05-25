import { UseGuards } from '@nestjs/common';
import { Mutation, Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { ApiQuery } from 'common/models/api-query.model';

import { BookmarkService } from './bookmark.service';

@Resolver('Bookmark')
export class BookmarkResolver {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @ResolveProperty('book')
  async getBook({ bookId }, args, context, info) {
    return await context.loaders.booksLoader.load(bookId);
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
