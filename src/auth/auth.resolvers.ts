import { Mutation, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation('login')
  async login(obj, args, context, info) {
    const { email, password } = args;
    return await this.authService.login(email, password);
  }

  @Mutation('signup')
  async signup(obj, args, context, info) {
    const { user } = args;
    return await this.authService.signup(user);
  }
}
