import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ManagedUpload } from 'aws-sdk/clients/s3';

@Injectable()
export class FileService {
  private s3bucket: S3;

  constructor() {
    this.s3bucket = new S3({
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadToS3(
    file: any,
    filename: string,
  ): Promise<ManagedUpload.SendData> {
    return await this.s3bucket
      .upload({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: filename,
        Body: file,
      })
      .promise();
  }

  async deleteFromS3(key: string) {
    return await this.s3bucket
      .deleteObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      })
      .promise();
  }
}
