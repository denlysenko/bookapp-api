import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { pubSubProvider } from 'core/providers/pubSub.provider';
import { LogsModule } from 'logs/logs.module';

import { CommentResolver } from './comments.resolvers';
import { CommentsService } from './comments.service';
import { CommentSchema } from './schemas/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
    LogsModule,
  ],
  providers: [CommentsService, CommentResolver, pubSubProvider],
  exports: [CommentsService],
})
export class CommentsModule {}
