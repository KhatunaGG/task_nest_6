import { Module } from '@nestjs/common';
import { AswS3Service } from './asw-s3.service';

@Module({
    providers: [AswS3Service],
    exports: [AswS3Service]
})
export class AwsS3Module {}
