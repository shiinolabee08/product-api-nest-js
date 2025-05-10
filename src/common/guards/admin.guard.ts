import {
  CanActivate,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { RolesEnum } from 'src/common/enums/roles.enum';

export class AdminGuard implements CanActivate {
  constructor(
    @Inject('AuthService') private readonly authService: AuthService,
  ) {}

  async canActivate(): Promise<boolean> {
    const user = this.authService.getAuthUser();

    if (user.role.id !== RolesEnum.ADMIN) {
      throw new ForbiddenException(
        'User not allowed to make a request. Not an admin type',
      );
    }

    return true;
  }
}
