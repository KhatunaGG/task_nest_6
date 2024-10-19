import { BadRequestException, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class AswS3Service {
  private bucketName;
  private serviceStorage;

  constructor() {
    this.bucketName = process.env.AWS_BUCKET_NAME;
    this.serviceStorage = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }


  
  async downloadImage(filePath: string) {
    try {
      if (!filePath) return;
      const config = {
        Bucket: this.bucketName,
        Key: filePath,
      };
      return await this.serviceStorage.getSignedUrlPromise('getObject', config);
    } catch (error) {
      console.log(error);
    }
  }


  async uploadImage(filePath, buffer) {
    try {
      const config = {
        Key: filePath,
        Bucket: this.bucketName,
        Body: buffer,
      };
      await this.serviceStorage.putObject(config).promise();
      const url = await this.downloadImage(filePath);
      return url;
    } catch (e) {
      throw new BadRequestException('Could not upload file');
    }
  }


  async deleteImg(filePath) {
    try {
      if (!filePath) return;
      const config = {
        Bucket: this.bucketName,
        Key: filePath,
      };
      console.log(filePath, 'filePath from awsS3 deleteImg');
      await this.serviceStorage.deleteObject(config).promise();
      return 'deleted successfully';
    } catch (error) {
      console.log(error);
    }
  }
}
