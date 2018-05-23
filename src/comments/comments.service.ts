import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Comment } from './interfaces/comment.interface';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel('Comment') private readonly commentModel: Model<Comment>,
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

    return await newComment.save();
  }
}
