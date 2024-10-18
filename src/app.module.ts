import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ExpensesModule } from './expenses/expenses.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AwsS3Module } from './aws-s3/aws-s3.module';
import { AswS3Service } from './aws-s3/asw-s3.service';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UsersModule,
    AuthModule,
    ExpensesModule,
    AwsS3Module,
  ],
  controllers: [AppController],
  providers: [AppService, AswS3Service],
})
export class AppModule {}
