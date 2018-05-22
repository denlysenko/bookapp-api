import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as crypto from 'crypto';
import * as _ from 'lodash';
import { Model } from 'mongoose';
import util from 'util';

import { User } from './interfaces/user.interface';

const randomBytesAsync = util.promisify(crypto.randomBytes);

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async findAll(): Promise<User[]> {
    return await this.userModel.findAll();
  }

  async findById(id: string): Promise<User> {
    return await this.userModel.findById(id);
  }

  async create(user: any): Promise<User> {
    const newUser = new this.userModel(user);
    newUser.displayName = `${newUser.firstName} ${newUser.lastName}`;
    return await newUser.save();
  }

  async update(id: string, updatedUser: any): Promise<User> {
    const user = await this.userModel.findById(id, '-salt -password');
    _.extend(user, updatedUser);
    user.displayName = `${user.firstName} ${user.lastName}`;
    return await user.save();
  }

  async changeAvatar() {}

  async changePassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<User> {
    const oldPass = String(oldPassword);
    const newPass = String(newPassword);

    const user = await this.userModel.findById(id);

    if (user.authenticate(oldPass)) {
      user.password = newPass;
      return await user.save();
    } else {
      throw new ForbiddenException();
    }
  }

  async requestResetPassword(email: string): Promise<string> {
    let token;
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('Email not found!');
    }

    const buffer = await randomBytesAsync(20);
    token = buffer.toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    return Promise.resolve(token);
  }

  async resetPassword(token: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      throw new NotFoundException('Token not found!');
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    return await user.save();
  }
}
