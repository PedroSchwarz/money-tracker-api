import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './packages/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsModule } from './packages/transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb+srv://${configService.get<string>(
          'DATABASE_USER',
        )}:${configService.get<string>(
          'DATABASE_PASSWORD',
        )}@cluster0.enijyz7.mongodb.net/?retryWrites=true&w=majority`,
      }),
    }),
    AuthModule,
    TransactionsModule,
  ],
})
export class AppModule {}
