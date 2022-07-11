import { Global, Module } from '@nestjs/common';
import { AWSProvider } from './aws.provider';
import { CognitoService } from './services/cognito.service';
import { AwsS3Service } from './services/s3.service';

@Global()
@Module({
  imports: [],
  providers: [AWSProvider, CognitoService, AwsS3Service],
  exports: [AWSProvider, CognitoService, AwsS3Service],
})
export class AwsModule {}
