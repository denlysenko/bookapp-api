import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsModule } from 'comments/comments.module';

import { BookService } from './book.service';
import { BooksResolvers } from './books.resolvers';
import { BookSchema } from './schemas/book.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Book', schema: BookSchema }]),
    CommentsModule,
  ],
  providers: [BookService, BooksResolvers],
})
export class BooksModule {}
