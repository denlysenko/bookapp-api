import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksModule } from 'books/books.module';

import { BookmarkResolver } from './bookmark.resolvers';
import { BookmarkService } from './bookmark.service';
import { BookmarkSchema } from './schemas/bookmark.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Bookmark', schema: BookmarkSchema }]),
    BooksModule,
  ],
  providers: [BookmarkService, BookmarkResolver],
})
export class BookmarksModule {}
