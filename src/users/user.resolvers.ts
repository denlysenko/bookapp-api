import { Mutation, Query, Resolver } from '@nestjs/graphql';

import { UserService } from './user.service';

@Resolver('Users')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query('users')
  async getUsers() {
    return await this.userService.findAll();
  }

  @Query('user')
  async getUser(obj, args, context, info) {
    const { id } = args;
    return await this.userService.findById(id);
  }

  @Query('me')
  async me() {}

  @Mutation('updateUser')
  async updateUser(obj, args, context, info) {
    const { id, user } = args;
    return await this.userService.update(id, user);
  }

  @Mutation('changePassword')
  async changePassword(obj, args, context, info) {
    const { id, newPassword, oldPassword } = args;
    return await this.userService.changePassword(id, oldPassword, newPassword);
  }

  @Mutation('requestResetPassword')
  async requestResetPassword(obj, args, context, info) {
    const { email } = args;
    return await this.userService.requestResetPassword(email);
  }

  @Mutation('resetPassword')
  async resetPassword(obj, args, context, info) {
    const { token, newPassword } = args;
    return await this.userService.resetPassword(token, newPassword);
  }

  @Mutation('deleteUser')
  async deleteUser(obj, args, context, info) {
    const { id } = args;
    return await this.userService.remove(id);
  }
}
