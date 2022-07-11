import { User } from 'src/modules/users/user.entity';

export interface VerifyLoginResponseInterface
  extends AWS.CognitoIdentityServiceProvider
    .AdminRespondToAuthChallengeResponse {
  readonly user: User;
}
