import {
  Inject, Injectable, Logger, NotFoundException, Scope, UnauthorizedException
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { createCognitoContextData } from 'src/common/aws/helpers/context-data.helper';
import { CognitoIdentityInterface } from 'src/common/aws/interfaces/cognito-identity.interface';
import { CognitoLoginRequestInterface } from 'src/common/aws/interfaces/cognito-login-request.interface';
import { CognitoService } from 'src/common/aws/services/cognito.service';
import { aliasEmail } from 'src/common/helpers/string.helper';
import { User } from '../users/user.entity';
import { UserRepository } from '../users/repositories/user.repository';
import { RolesEnum } from '../../common/enums/roles.enum';
import { LoginResponseDto } from './dtos/login.response.dto';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  private authorizedUser: User;

  private logger = new Logger(AuthService.name);

  constructor(
    @Inject(REQUEST) private request,
    private cognitoService: CognitoService,
    // private userWorkstationService: UserWorkstationService,
    private userRepository: UserRepository,
  ) {}

  /**
   * auth login
   *
   * @param data
   * @param cognitoContextData
   */
  async login(
    data: CognitoLoginRequestInterface
  ): Promise<LoginResponseDto> {
    const user: User = await this.userRepository.findOne({
      email: data.username,
    }, {
      relations: ['role', 'userWorkstations']
    });

    const origin = this.request.headers['access-control-allow-origin'] || '';

    // #TODO - need to review this code
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.verifiedEmail) {
      throw new UnauthorizedException('User is not yet verified');
    }

    // we need to know if its coming from the admin
    if (origin.indexOf('admin') > -1
      && user.role.id !== RolesEnum.ADMIN) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    // invoke cognito login method
    const loginResponse = await this.cognitoService.login(
      data,
      createCognitoContextData(this.request),
    );

    return {
      ...loginResponse?.AuthenticationResult,
      user
    };
  }

  /**
   * auth refresh token
   *
   * @param token
   */
  async refreshToken(
    data: CognitoIdentityInterface,
    token: string,
  ): Promise<AWS.CognitoIdentityServiceProvider.AdminInitiateAuthResponse> {
    return this.cognitoService.refreshToken(data, token);
  }

  async setAuthUser(email: string) {
    const isAliased = this.request.headers.aliased;
    let userEmail = email;

    // needed to set the aliased account
    if (isAliased === 'true') {
      userEmail = aliasEmail(email);
    }

    const authorizedUser = await this.userRepository.findOne({ email: userEmail }, {
      relations: ['role']
    });

    if (!authorizedUser) {
      throw new NotFoundException('User not found');
    }

    this.request.authorizedUser = authorizedUser;
  }

  getAuthUser(): User {
    return this.request.authorizedUser;
  }
}
