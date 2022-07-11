import { Injectable, Inject, Logger } from '@nestjs/common';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { User } from 'src/modules/users/user.entity';
import { ConfigService } from '@nestjs/config';
import { CognitoLoginRequestInterface } from '../interfaces/cognito-login-request.interface';
import { CognitoVerifyLoginRequestInterface } from '../interfaces/cognito-verify-login-request.interface';
import { UserpoolDetails } from '../interfaces/userpool-details.interface';
import { CognitoIdentityInterface } from '../interfaces/cognito-identity.interface';
import { AWSError } from '../../../errors/aws.error';

@Injectable()
export class CognitoService {
  private userPoolDetails: UserpoolDetails;

  private readonly logger: Logger = new Logger(CognitoService.name);

  private cognitoIdentityServiceProvider;

  constructor(
    @Inject('AWS_PROVIDER') private AWS,
    private readonly configService: ConfigService,
  ) {
    this.cognitoIdentityServiceProvider = new this.AWS.CognitoIdentityServiceProvider();
    this.userPoolDetails = {
      userpoolID: this.configService.get('COGNITO_USER_POOL_ID'),
      clientID: this.configService.get('COGNITO_APP_CLIENT_ID'),
    };
  }

  /**
   * initiates login on AWS Cognito
   *
   * @param data
   * @param ContextData
   */
  async login(
    data: CognitoLoginRequestInterface,
    ContextData: AWS.CognitoIdentityServiceProvider.ContextDataType,
  ) {
    const { username, password } = data;

    const params = {
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      ClientId: this.userPoolDetails.clientID /* required */,
      UserPoolId: this.userPoolDetails.userpoolID /* required */,
      ClientMetadata: {},
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
      ContextData,
    };

    try {
      const response = await this.cognitoIdentityServiceProvider
        .adminInitiateAuth(params)
        .promise();

      return response;
    } catch (error) {
      this.logger.error(error);
      return Promise.reject(new AWSError(error));
    }
  }

  /**
   * Verifies login on AWS cognito
   *
   * @param data
   * @param ContextData
   */
  async verifyLogin(
    data: CognitoVerifyLoginRequestInterface,
    ContextData: AWS.CognitoIdentityServiceProvider.ContextDataType,
  ): Promise<AWS.CognitoIdentityServiceProvider.AdminRespondToAuthChallengeResponse> {
    const { username, code, session } = data;

    const params = {
      ChallengeName: 'CUSTOM_CHALLENGE',
      ClientId: this.userPoolDetails.clientID /* required */,
      UserPoolId: this.userPoolDetails.userpoolID /* required */,
      ChallengeResponses: {
        USERNAME: username,
        ANSWER: code,
      },
      ContextData,
      Session: session,
    };

    try {
      const response = await this.cognitoIdentityServiceProvider
        .adminRespondToAuthChallenge(params)
        .promise();

      return response;
    } catch (error) {
      this.logger.error(error);
      return Promise.reject(new AWSError(error));
    }
  }

  /**
   * creates a cognito user
   *
   * @param user User data
   * @param TemporaryPassword Cognito User TemporaryPassword
   * @return Promise<boolean>
   */
  async createUser(user: User, TemporaryPassword: string): Promise<boolean> {
    const UserAttributes = [
      {
        Name: 'email',
        Value: user.email,
      },
      {
        Name: 'email_verified',
        Value: 'true',
      },
    ];

    const poolData = {
      UserPoolId: this.userPoolDetails.userpoolID,
      Username: user.email,
      MessageAction: 'SUPPRESS',
      TemporaryPassword,
      DesiredDeliveryMediums: ['EMAIL'],
      UserAttributes,
    };

    try {
      await this.cognitoIdentityServiceProvider
        .adminCreateUser(poolData)
        .promise();

      return true;
    } catch (error) {
      this.logger.error(error);
      return Promise.reject(new AWSError(error));
    }
  }

  /**
   * update cognito user
   *
   * @param user User data
   * @return Promise<boolean>
   */
  async updateCognitoUserAttributes(user: User): Promise<boolean> {
    const UserAttributes = [
      {
        Name: 'email',
        Value: user.email,
      },
      {
        Name: 'email_verified',
        Value: 'true',
      },
    ];

    const poolData = {
      UserPoolId: this.userPoolDetails.userpoolID,
      Username: user.email,
      UserAttributes,
    };

    try {
      const response = await this.cognitoIdentityServiceProvider
        .adminUpdateUserAttributes(poolData)
        .promise();

      return response;
    } catch (error) {
      this.logger.error(error);
      return Promise.reject(new AWSError(error));
    }
  }

  /**
   * verify cognito account upon creation
   *
   * @param user
   * @param password
   * @param newPassword
   * @param req
   * @return Promise<boolean>
   */
  async changeTempCognitoPassword(
    user: User,
    password: string,
    newPassword: string,
    ContextData: AWS.CognitoIdentityServiceProvider.ContextDataType,
  ): Promise<boolean> {
    // initialize the changing of temporary cognito password
    const data = await this.initChangeTempCognitoPassword(
      user,
      password,
      ContextData,
    );

    // change the cognito temporary password
    await this.verifyChangeTempCognitoPassword(
      {
        username: user.email,
        password,
        newPassword,
        session: data.Session,
      },
      ContextData,
    );

    return true;
  }

  /**
   * initiate change of temporary cognito password
   *
   * @param user
   * @param password
   * @param req
   * @return Promise<boolean>
   */
  async initChangeTempCognitoPassword(
    user: User,
    password: string,
    ContextData: AWS.CognitoIdentityServiceProvider.ContextDataType,
  ): Promise<AWS.CognitoIdentityServiceProvider.AdminRespondToAuthChallengeResponse> {
    const params = {
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      ClientId: this.userPoolDetails.clientID,
      UserPoolId: this.userPoolDetails.userpoolID,
      ClientMetadata: {},
      AuthParameters: {
        USERNAME: user.email,
        PASSWORD: password,
      },
      ContextData,
    };

    try {
      const response = await this.cognitoIdentityServiceProvider
        .adminInitiateAuth(params)
        .promise();

      return response;
    } catch (error) {
      this.logger.error(error);
      return Promise.reject(new AWSError(error));
    }
  }

  /**
   * change the user temporary password in cognito
   *
   * @param data
   * @param req
   * @return Promise<any>
   */
  async verifyChangeTempCognitoPassword(
    data,
    ContextData: AWS.CognitoIdentityServiceProvider.ContextDataType,
  ): Promise<AWS.CognitoIdentityServiceProvider.AdminRespondToAuthChallengeRequest> {
    const {
      username, password, newPassword, session,
    } = data;

    const params = {
      ChallengeName: 'NEW_PASSWORD_REQUIRED',
      ClientId: this.userPoolDetails.clientID /* required */,
      UserPoolId: this.userPoolDetails.userpoolID /* required */,
      ChallengeResponses: {
        USERNAME: username,
        PASSWORD: password,
        NEW_PASSWORD: newPassword,
      },
      ContextData,
      Session: session,
    };

    try {
      const response = await this.cognitoIdentityServiceProvider
        .adminRespondToAuthChallenge(params)
        .promise();

      return response;
    } catch (error) {
      this.logger.error(error);
      return Promise.reject(new AWSError(error));
    }
  }

  /**
   * update cognito user status
   *
   * @param user cognito username
   * @return Promise<any>
   */
  updateCognitoUserStatus(
    user: User,
  ): Promise<
    | AWS.CognitoIdentityServiceProvider.AdminEnableUserRequest
    | AWS.CognitoIdentityServiceProvider.AdminDisableUserRequest
    > {
    // check user status
    const request = this.enableCognitoUserStatus(user.email);

    return request;
  }

  /**
   * enable cognito user status
   *
   * @param username cognito username
   * @return Promise<AWS.CognitoIdentityServiceProvider.AdminEnableUserRequest>
   */
  private async enableCognitoUserStatus(
    username: string,
  ): Promise<AWS.CognitoIdentityServiceProvider.AdminEnableUserRequest> {
    const params = {
      UserPoolId: this.userPoolDetails.userpoolID,
      Username: username,
    };

    try {
      const response = await this.cognitoIdentityServiceProvider
        .adminEnableUser(params)
        .promise();

      return response;
    } catch (error) {
      this.logger.error(error);
      return Promise.reject(new AWSError(error));
    }
  }

  /**
   * enable cognito user status
   *
   * @param username cognito username
   * @return Promise<AWS.CognitoIdentityServiceProvider.AdminDisableUserRequest>
   */
  private async disableCognitoUserStatus(
    username: string,
  ): Promise<AWS.CognitoIdentityServiceProvider.AdminDisableUserRequest> {
    const params = {
      UserPoolId: this.userPoolDetails.userpoolID,
      Username: username,
    };

    try {
      const response = await this.cognitoIdentityServiceProvider
        .adminDisableUser(params)
        .promise();
      return response;
    } catch (error) {
      return Promise.reject(new AWSError(error));
    }
  }

  /**
   * Get Cognito user.
   * @param username
   * @returns Promise<CognitoIdentityServiceProvider.AdminGetUserResponse>
   */
  async getCognitoUser(
    username: string,
  ): Promise<CognitoIdentityServiceProvider.AdminGetUserResponse> {
    return new Promise<CognitoIdentityServiceProvider.AdminGetUserResponse>(
      (resolve) => {
        const params: CognitoIdentityServiceProvider.AdminGetUserRequest = {
          UserPoolId: this.userPoolDetails.userpoolID,
          Username: username,
        };

        this.cognitoIdentityServiceProvider.adminGetUser(
          params,
          (error, data) => {
            if (error) {
              // reject(new AWSError(error));
              resolve(error);
            }
            resolve(data);
          },
        );
      },
    );
  }

  /**
   * register the user to aws cognito user pool.
   * @param userData
   * @param password
   * @param contextData
   */
  async registerUser(
    userData: User,
    password: string,
    contextData,
  ) {
    // generate another random string for the new password in aws cognito.
    const temporarPassword = 'T@st1234';

    // create the aws cognito user.
    await this.createUser(userData, temporarPassword);

    // change the temporary password of the cognito to remove FORCE_CHANGE_PASSWORD status.
    await this.changeTempCognitoPassword(
      userData,
      temporarPassword,
      password,
      contextData,
    );

    // set the aws cognito user's status.
    await this.updateCognitoUserStatus(userData);
  }

  /**
   * AWS Cognito refresh token
   *
   * @param token
   */
  async refreshToken(
    data: CognitoIdentityInterface,
    token: string,
  ): Promise<AWS.CognitoIdentityServiceProvider.AdminInitiateAuthResponse> {
    try {
      const { clientID, userpoolID } = data;
      const response = await this.cognitoIdentityServiceProvider
        .adminInitiateAuth({
          AuthFlow: 'REFRESH_TOKEN',
          ClientId: clientID,
          UserPoolId: userpoolID,
          AuthParameters: {
            REFRESH_TOKEN: token,
          },
        })
        .promise();

      return response;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  /**
   * AWS Cognito refresh token
   *
   * @param token
   */
  async deleteUser(username: string):
  Promise<AWS.CognitoIdentityServiceProvider.AdminInitiateAuthResponse> {
    try {
      const response = await this.cognitoIdentityServiceProvider
        .adminDeleteUser({
          UserPoolId: this.userPoolDetails.userpoolID /* required */,
          Username: username,
        })
        .promise();

      return response;
    } catch (error) {
      this.logger.error(error);
      return Promise.reject(new AWSError(error));
    }
  }

  /**
   * AWS Cognito set user password
   *
   * @param token
   */
  async adminSetUserPassword(username: string, password: string):
  Promise<AWS.CognitoIdentityServiceProvider.AdminInitiateAuthResponse> {
    try {
      const response = await this.cognitoIdentityServiceProvider
        .adminSetUserPassword({
          UserPoolId: this.userPoolDetails.userpoolID /* required */,
          Password: password,
          Username: username,
          Permanent: true,

        })
        .promise();

      return response;
    } catch (error) {
      this.logger.error(error);
      return Promise.reject(new AWSError(error));
    }
  }
}
