import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesModule } from 'files/files.module';

import { UserSchema } from './schemas/user.schema';
import { UserResolver } from './user.resolvers';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    FilesModule,
  ],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UsersModule {}
