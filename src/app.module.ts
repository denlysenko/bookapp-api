import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLFactory } from '@nestjs/graphql';
import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import { AuthModule } from 'auth/auth.module';
import { BookmarksModule } from 'bookmarks/bookmarks.module';
import { BookService } from 'books/book.service';
import { BooksModule } from 'books/books.module';
import { CommentsModule } from 'comments/comments.module';
import { CoreModule } from 'core/core.module';
import * as DataLoader from 'dataloader';
import { FilesModule } from 'files/files.module';
import { LogsModule } from 'logs/logs.module';
import { SubscriptionService } from 'subscriptions/subscription.service';
import { UsersModule } from 'users/user.module';
import { UserService } from 'users/user.service';
import { formatError } from 'utils/formatError';

@Module({
  imports: [
    CoreModule,
    AuthModule,
    UsersModule,
    BooksModule,
    CommentsModule,
    BookmarksModule,
    LogsModule,
    FilesModule,
  ],
})
export class AppModule implements NestModule {
  constructor(
    private readonly graphQLFactory: GraphQLFactory,
    private readonly subscriptionService: SubscriptionService,
    private readonly bookService: BookService,
    private readonly userService: UserService,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    const schema = this.createSchema();

    const loaders = {
      booksLoader: new DataLoader(
        async (bookIds: string[]) => {
          const books = await this.bookService.findByIds(bookIds);
          const data = {};
          books.forEach(book => {
            data[book._id] = book;
          });

          return bookIds.map(id => data[id]);
        },
        { cacheKeyFn: id => id.toString() },
      ),
      usersLoader: new DataLoader(
        async (userIds: string[]) => {
          const users = await this.userService.findByIds(userIds);
          const data = {};
          users.forEach(user => {
            data[user._id] = user;
          });

          return userIds.map(id => data[id]);
        },
        { cacheKeyFn: id => id.toString() },
      ),
    };

    this.subscriptionService.createServer(schema, {
      onOperation: (_, params) => {
        return { ...params, context: { loaders } };
      },
    });

    consumer
      .apply(
        graphiqlExpress({
          endpointURL: '/graphql',
          subscriptionsEndpoint: 'ws://localhost:3002/subscriptions',
        }),
      )
      .forRoutes('/graphiql')
      .apply(
        graphqlExpress(req => ({
          schema,
          rootValue: req,
          context: {
            loaders,
          },
          formatError,
        })),
      )
      .forRoutes('/graphql');
  }

  private createSchema() {
    const typeDefs = this.graphQLFactory.mergeTypesByPaths('./**/*.graphql');
    return this.graphQLFactory.createSchema({ typeDefs });
  }
}
