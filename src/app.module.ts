import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLFactory } from '@nestjs/graphql';
import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import { AuthModule } from 'auth/auth.module';
import { BookmarksModule } from 'bookmarks/bookmarks.module';
import { BooksModule } from 'books/books.module';
import { CommentsModule } from 'comments/comments.module';
import { CoreModule } from 'core/core.module';
import { LogsModule } from 'logs/logs.module';
import { SubscriptionService } from 'subscriptions/subscription.service';
import { UsersModule } from 'users/user.module';

@Module({
  imports: [
    CoreModule,
    AuthModule,
    UsersModule,
    BooksModule,
    CommentsModule,
    BookmarksModule,
    LogsModule,
  ],
})
export class AppModule implements NestModule {
  constructor(
    private readonly graphQLFactory: GraphQLFactory,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    const schema = this.createSchema();
    this.subscriptionService.createServer(schema);

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
        })),
      )
      .forRoutes('/graphql');
  }

  private createSchema() {
    const typeDefs = this.graphQLFactory.mergeTypesByPaths('./**/*.graphql');
    return this.graphQLFactory.createSchema({ typeDefs });
  }
}
