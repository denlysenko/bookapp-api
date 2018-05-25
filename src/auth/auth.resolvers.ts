import { Mutation, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation()
  async login(obj, { email, password }, context, info) {
    return await this.authService.login(email, password);
  }

  @Mutation()
  async signup(obj, { user }, context, info) {
    return await this.authService.signup(user);
  }
}
