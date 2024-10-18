import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserScheme } from './schema/users.schema';
import { AwsS3Module } from 'src/aws-s3/aws-s3.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserScheme }]),
    AwsS3Module,
    forwardRef(() => AuthModule)
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
