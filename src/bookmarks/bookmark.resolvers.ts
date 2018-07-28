import { UseGuards } from '@nestjs/common';
import { Mutation, Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { ApiQuery } from 'common/models/api-query.model';

import { BookmarkService } from './bookmark.service';

@Resolver('Bookmark')
export class BookmarkResolver {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @ResolveProperty('book')
  async getBook({ bookId }, _, { loaders }) {
    return await loaders.booksLoader.load(bookId);
  }

  @Query('bookmarks')
  @UseGuards(AuthGuard('jwt'))
  async getBookmarks(_, { type, skip, first }, __, info) {
    const userId = info.rootValue.user._id;
    return await this.bookmarkService.getByType(
      new ApiQuery({ type, userId }, first, skip),
    );
  }

  @Query('userBookmarksByBook')
  @UseGuards(AuthGuard('jwt'))
  async getUserBookmarksByBook(_, { bookId }, __, info) {
    const userId = info.rootValue.user._id;
    return await this.bookmarkService.getByUserAndBook(userId, bookId);
  }

  @Mutation()
  @UseGuards(AuthGuard('jwt'))
  async addToBookmarks(_, { type, bookId }, __, info) {
    const userId = info.rootValue.user._id;
    return await this.bookmarkService.addToBookmarks(type, userId, bookId);
  }

  @Mutation()
  @UseGuards(AuthGuard('jwt'))
  async removeFromBookmarks(_, { type, bookId }, __, info) {
    const userId = info.rootValue.user._id;
    return await this.bookmarkService.removeFromBookmarks(type, userId, bookId);
  }
}
