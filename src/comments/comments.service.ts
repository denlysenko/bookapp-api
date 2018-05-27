import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LogDto } from 'logs/dto/log.dto';
import { LogService } from 'logs/log.service';
import { Model } from 'mongoose';

import { USER_ACTIONS } from '../constants';
import { Comment } from './interfaces/comment.interface';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel('Comment') private readonly commentModel: Model<Comment>,
    private readonly logService: LogService,
  ) {}

  async getAllForBook(bookId: string) {
    return await this.commentModel.find({ bookId }).exec();
  }

  async saveForBook(bookId: string, authorId: string, text: string) {
    const newComment = new this.commentModel({
      bookId,
      authorId,
      text,
    });

    await newComment.save();
    await this.logService.create(
      new LogDto(authorId, USER_ACTIONS.COMMENT_ADDED, bookId),
    );
    return newComment;
  }
}
