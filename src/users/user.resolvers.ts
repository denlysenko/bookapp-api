import { UseGuards } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'common/decorators/role.decorator';
import { RolesGuard } from 'common/guards/roles.guard';
import { ApiQuery } from 'common/models/api-query.model';
import { convertToMongoSortQuery } from 'utils/mongoSortQueryConverter';

import { ROLES } from '../constants';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query('users')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLES.ADMIN)
  async getUsers(obj, { filter, skip, first, orderBy }, context, info) {
    const order = (orderBy && convertToMongoSortQuery(orderBy)) || null;
    return await this.userService.findAll(
      new ApiQuery(
        filter && { [filter.field]: new RegExp(`^${filter.search}`, 'i') },
        first,
        skip,
        order,
      ),
    );
  }

  @Query('user')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLES.ADMIN)
  async getUser(obj, { id }, context, info) {
    return await this.userService.findById(id);
  }

  @Query()
  @UseGuards(AuthGuard('jwt'))
  async me(obj, args, context, info) {
    const id = info.rootValue.user._id;
    return await this.userService.findById(id);
  }

  @Mutation()
  @UseGuards(AuthGuard('jwt'))
  async updateUser(obj, { id, user }, context, info) {
    return await this.userService.update(id, user);
  }

  @Mutation()
  @UseGuards(AuthGuard('jwt'))
  async changePassword(obj, { id, newPassword, oldPassword }, context, info) {
    return await this.userService.changePassword(id, oldPassword, newPassword);
  }

  @Mutation()
  async requestResetPassword(obj, { email }, context, info) {
    return await this.userService.requestResetPassword(email);
  }

  @Mutation()
  async resetPassword(obj, { token, newPassword }, context, info) {
    return await this.userService.resetPassword(token, newPassword);
  }

  @Mutation()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLES.ADMIN)
  async deleteUser(obj, { id }, context, info) {
    return await this.userService.remove(id);
  }
}
