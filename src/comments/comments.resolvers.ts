import { Inject, UseGuards } from '@nestjs/common';
import { Mutation, ResolveProperty, Resolver, Subscription } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import * as DataLoader from 'dataloader';
import { PubSub } from 'graphql-subscriptions';
import { UserService } from 'users/user.service';

import { PUB_SUB } from '../constants';
import { CommentsService } from './comments.service';

@Resolver('Comment')
export class CommentResolver {
  usersLoader: any;

  constructor(
    private readonly userService: UserService,
    private readonly commentService: CommentsService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
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
    const comment = await this.commentService.saveForBook(
      bookId,
      authorId,
      text,
    );
    this.pubSub.publish('commentAdded', { commentAdded: comment });
    return comment;
  }

  @Subscription()
  commentAdded() {
    return {
      subscribe: () => this.pubSub.asyncIterator('commentAdded'),
    };
  }
}
