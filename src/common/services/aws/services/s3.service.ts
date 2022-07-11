import {
  Injectable, Inject, Logger, BadRequestException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as tk from 'timekeeper';
import * as path from 'path';
import * as moment from 'moment';
import * as CryptoJS from 'crypto-js';
import { FileInfo, FileUpload } from '../interfaces/file-upload.interface';
import nanoid from '../../../helpers/nanoid.helper';

@Injectable()
export class AwsS3Service {
  private readonly logger: Logger = new Logger(AwsS3Service.name);

  private readonly bucketName;

  private readonly awsS3;

  private readonly signedUrlExpireSeconds = 3600; // 60 * 10;

  constructor(
    @Inject('AWS_PROVIDER') private AWS,
    private readonly config: ConfigService,
  ) {
    // name of the s3 bucket for file storage
    this.bucketName = this.config.get('AWS_S3_BUCKET_NAME_UPLOAD');

    this.awsS3 = new this.AWS.S3();
  }

  async getBase64EncodedObject(key: string) {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: key
      };

      const foundObject = await this.awsS3.getObject(params).promise();

      const base64Encoded = foundObject.Body.toString('base64');

      return CryptoJS.AES.encrypt(
        base64Encoded,
        process.env.CRYPTO_SECRET_KEY
      ).toString();
    } catch (e) {
      // this.logger.error(`${e}:${key}`);
      throw new BadRequestException('attachment not found');
    }
  }

  async getObject(key: string) {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: key
      };

      const foundObject = await this.awsS3.getObject(params).promise();

      return foundObject;
    } catch (e) {
      this.logger.error(`${e}:${key}`);

      return null;
    }
  }

  async putObject(buffer: Buffer, args: FileInfo): Promise<FileUpload> {
    try {
      if (args.autoGenerateName == null && !args.filename) {
        this.logger.error('filename is required');
        throw new Error('filename is required');
      }

      const fileInfo = path.parse(args.filename);
      const timestamp = moment.utc().valueOf();
      const name = args.autoGenerateName
        ? `${timestamp}_${nanoid(13)}${fileInfo.ext.toLowerCase()}`
        : args.filename;

      const filename = name;
      const Key = args.directory ? `${args.directory}/${filename}` : filename;

      const params = {
        Body: buffer,
        Bucket: this.bucketName,
        Key,
      };

      await this.awsS3.putObject(params).promise();

      return {
        attachment: Key,
        originalName: fileInfo.base,
        size: buffer.length,
        mime: args.mime,
      };
    } catch (e) {
      this.logger.debug(args);
      return Promise.reject(e);
    }
  }

  async getSignedObject(name: string) {
    try {
      const currentTime = new Date();
      const d = new Date(currentTime);

      d.setMinutes(Math.floor(d.getMinutes() / 10) * 10);
      d.setSeconds(0);
      d.setMilliseconds(0);

      const url = tk.withFreeze(d, () => this.awsS3.getSignedUrl('getObject', {
        Bucket: this.bucketName,
        Key: name,
        Expires: this.signedUrlExpireSeconds,
        ResponseContentType: ''
      }));

      return url;
    } catch (e) {
      this.logger.error(e);
      return Promise.reject(e);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-shadow
  async copyObject(source: string, key: string) {
    try {
      const params = {
        Bucket: this.bucketName,
        CopySource: `${this.bucketName}/${source}`,
        Key: key,
      };

      return this.awsS3.copyObject(params, (copyErr, copyData) => {
        if (copyErr) {
          return false;
        }

        const data = copyData;
        data.key = key;

        return data;
      }).promise();
    } catch (e) {
      this.logger.error(key);
      return Promise.reject(e);
    }
  }

  async moveObject(source: string, key: string, isDeleteSource: boolean = false) {
    try {
      const foundSource = await this.getObject(source);

      if (foundSource) {
        const copiedObject = await this.copyObject(source, key);

        if (copiedObject && isDeleteSource) {
          await this.deleteObject(source);
        }
      }

      return key;
    } catch (e) {
      this.logger.debug(key);
      return Promise.reject(e);
    }
  }

  async deleteObject(name: string) {
    try {
      await this.awsS3.deleteObject({
        Bucket: this.bucketName,
        Key: name,
      }).promise();

      return { name };
    } catch (e) {
      this.logger.debug(name);
      return Promise.reject(e);
    }
  }
}
