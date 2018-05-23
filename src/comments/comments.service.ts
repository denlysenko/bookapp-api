import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'users/interfaces/user.interface';

import { Comment } from './interfaces/comment.interface';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel('Comment') private readonly commentModel: Model<Comment>,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  async getAllForBook(bookId: string) {
    return await this.commentModel
      .find({ bookId })
      .populate({
        path: 'messages.author',
        select: 'displayName',
        model: this.userModel,
      })
      .exec();
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
