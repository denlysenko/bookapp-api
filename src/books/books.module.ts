import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsModule } from 'comments/comments.module';
import { pubSubProvider } from 'core/providers/pubSub.provider';

import { BookService } from './book.service';
import { BooksResolvers } from './books.resolvers';
import { BookSchema } from './schemas/book.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Book', schema: BookSchema }]),
    CommentsModule,
  ],
  providers: [BookService, BooksResolvers, pubSubProvider],
})
export class BooksModule {}
