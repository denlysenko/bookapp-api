import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLFactory, GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import { AuthModule } from 'auth/auth.module';
import { BooksModule } from 'books/books.module';
import { CommentsModule } from 'comments/comments.module';
import { ConfigModule } from 'config/config.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { UsersModule } from 'users/user.module';

dotenv.config({
  path: path.resolve(
    process.cwd(),
    `./src/config/${process.env.NODE_ENV}/.env`,
  ),
});

@Module({
  imports: [
    GraphQLModule,
    MongooseModule.forRoot(`mongodb://mongodb`, {
      user: process.env.DB_USER,
      pass: process.env.DB_PASSWORD,
      dbName: process.env.DB_NAME,
    }),
    ConfigModule,
    AuthModule,
    UsersModule,
    BooksModule,
    CommentsModule,
  ],
})
export class AppModule implements NestModule {
  constructor(private readonly graphQLFactory: GraphQLFactory) {}

  configure(consumer: MiddlewareConsumer) {
    const schema = this.createSchema();

    consumer
      .apply(graphiqlExpress({ endpointURL: '/graphql' }))
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
