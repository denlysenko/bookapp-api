import { Inject, UseGuards } from '@nestjs/common';
import { Mutation, ResolveProperty, Resolver, Subscription } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { PubSub } from 'graphql-subscriptions';

import { PUB_SUB } from '../constants';
import { CommentsService } from './comments.service';

@Resolver('Comment')
export class CommentResolver {
  constructor(
    private readonly commentService: CommentsService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @ResolveProperty('author')
  async getAuthor({ authorId }, _, { loaders }) {
    return await loaders.usersLoader.load(authorId);
  }

  @Mutation()
  @UseGuards(AuthGuard('jwt'))
  async addComment(_, { bookId, text }, __, info) {
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
