import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

/**
 * Provider used for making API calls to AWS.
 */
export const AWSProvider = {
  provide: 'AWS_PROVIDER',
  useFactory: (config: ConfigService) => {
    const profile = config.get('AWS_PROFILE');
    if (profile) {
      const credentials = new AWS.SharedIniFileCredentials({ profile });
      AWS.config.credentials = credentials;
    } else {
      AWS.config.update({
        accessKeyId: config.get('AWS_ACCESS_KEY'),
        secretAccessKey: config.get('AWS_SECRET_ACCESS_KEY'),
        sessionToken: config.get('AWS_SESSION_TOKEN'),
      });
    }
    const region = config.get('AWS_REGION') || 'us-east-1';
    AWS.config.update({ region });
    return AWS;
  },
  inject: [ConfigService],
};
