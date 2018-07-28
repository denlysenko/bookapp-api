import { Mutation, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation()
  async login(_, { email, password }) {
    return await this.authService.login(email, password);
  }

  @Mutation()
  async signup(_, { user }) {
    return await this.authService.signup(user);
  }
}
