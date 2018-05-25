import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogsModule } from 'logs/logs.module';

import { BookmarkResolver } from './bookmark.resolvers';
import { BookmarkService } from './bookmark.service';
import { BookmarkSchema } from './schemas/bookmark.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Bookmark', schema: BookmarkSchema }]),
    LogsModule,
  ],
  providers: [BookmarkService, BookmarkResolver],
})
export class BookmarksModule {}
