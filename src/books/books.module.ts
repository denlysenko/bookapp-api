import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BookSchema } from './schemas/book.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Book', schema: BookSchema }])],
})
export class BooksModule {}
