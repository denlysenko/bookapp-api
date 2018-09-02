import * as googleStorage from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { format } from 'util';

const storage = googleStorage({
  projectId: process.env.FIREBASE_PROJECT_ID,
  keyFilename: 'bookapp-cd051-firebase-adminsdk-5khci-fe7cf2f3b5.json',
});

@Injectable()
export class FileService {
  private bucket: any;

  constructor() {
    this.bucket = storage.bucket(process.env.FIREBASE_BUCKET_URL);
  }

  uploadToBucket(file: any, filename: string): Promise<{ publicUrl: string }> {
    return new Promise((resolve, reject) => {
      const blob = this.bucket.file(filename);

      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      blobStream.on('error', error => {
        reject(error);
      });

      blobStream.on('finish', () => {
        const publicUrl = format(
          `https://firebasestorage.googleapis.com/v0/b/${this.bucket.name}/o/${
            blob.name
          }?alt=media`,
        );
        resolve({ publicUrl });
      });

      blobStream.end(file);
    });
  }

  deleteFromBucket(key: string): Promise<any> {
    return this.bucket.file(key).delete();
  }
}
