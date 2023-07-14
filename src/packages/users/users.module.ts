import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, preConfiguration } from './model/user.schema';
import { UsersService } from './service/users.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: preConfiguration,
      },
    ]),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
