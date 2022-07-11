import AWS from "aws-sdk";

export interface LoginResponseInterface
  extends AWS.CognitoIdentityServiceProvider.AdminInitiateAuthResponse {
  readonly ChallengeName?: string;
  readonly ChallengeParameters?;
}
