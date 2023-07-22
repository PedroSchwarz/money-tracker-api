import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../model/user.schema';
import { CreateUserDTO } from '../dto/createUser.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDTO: CreateUserDTO): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDTO);
    return createdUser.save();
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).select('+password');
  }
}
