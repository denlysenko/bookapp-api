import { Module } from '@nestjs/common';
import { UsersModule } from 'users/user.module';

import { AuthResolver } from './auth.resolvers';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [UsersModule],
  providers: [AuthService, AuthResolver, JwtStrategy],
})
export class AuthModule {}
