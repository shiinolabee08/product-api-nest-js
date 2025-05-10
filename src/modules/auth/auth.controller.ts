import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { RolesEnum } from 'src/common/enums/roles.enum';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dtos/login.request.dto';
import { VerifyRequestDto } from './dtos/verify.request.dto';
import { Verification } from './verifications/verification.entity';
import { SetUserRolePipe } from './pipes/set-user-role.pipe';
import { CreateUserRequestDto, VerifyResendRequestDto } from './dtos';
// import { UsersService } from '../users/services/users.service';
import { LoginResponseDto } from './dtos/login.response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    // private usersService: UsersService,
  ) {}

  @Post('login')
  async login(
    @Body() credentials: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    return this.authService.login(
      credentials,
    );
  }

  /* @Post('verify')
  async verify(@Body() credentials: VerifyRequestDto): Promise<Verification> {
    return this.usersService.verifyUser2(credentials);
  }

  @Post('verify/resend')
  async verifyResend(@Body() data: VerifyResendRequestDto): Promise<boolean> {
    return this.usersService.verifyResend(data);
  }

  // new workflow
  // we need to setup a generic role, for now it's the TP
  @Post('register')
  async register(@Body(new SetUserRolePipe(RolesEnum.TRADESPERSON)) createUserDto: CreateUserRequestDto, @Req() request) {
    return this.usersService.createGenericUser(createUserDto, request);
  } 

  @Get('verify/email/:email')
  async validateEmail(@Param('email') email: string) {
    return this.usersService.validateEmail(email);
  }

  @Get('verify/phone-number/:contactNo')
  async validatePhoneNumber(@Param('contactNo') contactNo: string) {
    return this.usersService.validatePhoneNumber(contactNo);
  }*/
}
