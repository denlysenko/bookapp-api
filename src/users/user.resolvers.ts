import { UseGuards } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'common/decorators/role.decorator';
import { RolesGuard } from 'common/guards/roles.guard';

import { UserService } from './user.service';

// TODO move to constans, use also in User.schema
const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

@Resolver('Users')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query('users')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLES.ADMIN)
  async getUsers() {
    return await this.userService.findAll();
  }

  @Query('user')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLES.ADMIN)
  async getUser(obj, args, context, info) {
    const { id } = args;
    return await this.userService.findById(id);
  }

  @Query('me')
  @UseGuards(AuthGuard('jwt'))
  async me(obj, args, context, info) {
    const id = info.rootValue.user._id;
    return await this.userService.findById(id);
  }

  @Mutation('updateUser')
  @UseGuards(AuthGuard('jwt'))
  async updateUser(obj, args, context, info) {
    const { id, user } = args;
    return await this.userService.update(id, user);
  }

  @Mutation('changePassword')
  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLES.ADMIN)
  async deleteUser(obj, args, context, info) {
    const { id } = args;
    return await this.userService.remove(id);
  }
}
