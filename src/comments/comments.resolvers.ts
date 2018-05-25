import { UseGuards } from '@nestjs/common';
import { Mutation, ResolveProperty, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import * as DataLoader from 'dataloader';
import { UserService } from 'users/user.service';

import { CommentsService } from './comments.service';

@Resolver('Comment')
export class CommentResolver {
  usersLoader: any;

  constructor(
    private readonly userService: UserService,
    private readonly commentService: CommentsService,
  ) {
    this.usersLoader = new DataLoader((userIds: string[]) => {
      const promises = userIds.map(id => {
        return userService.findById(id);
      });
      return Promise.all(promises);
    });
  }

  @ResolveProperty('author')
  async getAuthor({ authorId }, args, context, info) {
    return await this.usersLoader.load(authorId);
  }

  @Mutation()
  @UseGuards(AuthGuard('jwt'))
  async addComment(obj, { bookId, text }, context, info) {
    const authorId = info.rootValue.user._id;
    return await this.commentService.saveForBook(bookId, authorId, text);
  }
}
