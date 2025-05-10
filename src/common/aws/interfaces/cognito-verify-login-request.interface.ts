import { CognitoLoginRequestInterface } from './cognito-login-request.interface';

export interface CognitoVerifyLoginRequestInterface
  extends CognitoLoginRequestInterface {
  readonly code: string;
  readonly session: string;
}
