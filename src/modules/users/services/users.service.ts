import { BadRequestException, Injectable, Logger, UnprocessableEntityException } from '@nestjs/common';
import { createCognitoContextData } from '../../../common/services/aws/helpers/context-data.helper';
import { CognitoService } from '../../../common/services/aws/services/cognito.service';
import { PostCodeIoService } from '../../../common/services/postcode-io.service';
import { CreateUserRequestDto } from '../dtos/request/create-user.request.dto';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../user.entity';
// import { VerifyRequestDto } from '../../auth/dtos';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private userRepository: UserRepository,
    private postCodeIoService: PostCodeIoService,
    private cognitoService: CognitoService,
  ) {}

  async findAll(filters): Promise<User[]> {
    return this.userRepository.find(filters);
  }

  getUser(userId: number): Promise<User> {
    return this.userRepository.findOneOrFail(
      userId,
      /* {
        relations: [
          'userPublicProfile',
        ],
      }, */
    );
  }

  async createUser(createUserRequestDto: CreateUserRequestDto, request: Request) {
    this.validateUserData(createUserRequestDto);

    const {
      firstName, lastName, email, password, birthDate, postcode, contactNo, address
    } = createUserRequestDto;
    try {
      return await this.userRepository.manager.transaction(async (entityManager) => {
        const userData = {
          firstName,
          lastName,
          email,
          password,
          birthDate,
          postcode,
          contactNo,
          address,
        };

        const user = await entityManager.save(User, userData);

        try {
          await this.cognitoService.registerUser(
            user,
            createUserRequestDto.password,
            createCognitoContextData(request),
          );
        } catch (e) {
          // remove the mysql user if there's an error
          await this.cognitoService.deleteUser(user.email);
          throw e;
        }

        return user;
      });
    } catch (e) {
      this.logger.error(e);
      // remove the cognito user.
      if (e.code === 400 && e.message.indexOf('Password') !== -1) {
        // invalid password for cognito
        this.logger.debug({ data: Buffer.from(createUserRequestDto?.password).toString('base64') });
        throw new BadRequestException('Password requirement not met. Please try again');
      } else {
        throw new BadRequestException('Error in creating user. Please try again');
      }
    }
  }

  private async validateUserData(createUserRequestDto: CreateUserRequestDto) {
    const { contactNo, email, postcode } = createUserRequestDto;

    // try to check if the email exists;
    const emailExists = await this.userRepository.findOne({ email });

    if (emailExists) {
      throw new UnprocessableEntityException('Email already in use');
    }

    // check the postcode
    try {
      await this.postCodeIoService.validatePostCode(postcode);
    } catch {
      throw new UnprocessableEntityException(
        'Please enter a valid UK postcode',
      );
    }
  }

  /* async verifyUser2(credentials: VerifyRequestDto) {
    const verificationRecord = await this.verificationRepository.verifyCode(
      credentials,
    );

    // update user set verified to true
    if (verificationRecord) {
      const findUserToVerify = await this.userRepository.findOne({
        email: credentials.email,
      });
      const updateUserDto = { verifiedEmail: true };
      const verifiedUser = await this.userRepository.update(
        findUserToVerify.id,
        updateUserDto,
      );

      if (verifiedUser) {
        await this.verificationRepository.delete({
          email: verificationRecord.email
        });
      }

      // Refer a tradesperson event will initialize here
      const referATradespersonEmailEvent = {
        toUserId: findUserToVerify.id,
        recipient: findUserToVerify.email,
        name: NotificationTemplateEnum.REFER_A_TRADESPERSON,
        metaData: {
          referralCode: findUserToVerify.referralCode,
        },
      } as ReferATradespersonEmailEvent;

      await this.emailNotificationService.sendEmail<ReferATradespersonEmailInterface>(referATradespersonEmailEvent);

      // Welcome notification event will initialize here
      const welcomeEmailEvent = {
        toUserId: findUserToVerify.id,
        recipient: findUserToVerify.email,
        name: (
          findUserToVerify.role.id === RolesEnum.TRADESPERSON
            ? NotificationTemplateEnum.TP_REGISTRATION : NotificationTemplateEnum.PO_REGISTRATION
        ),
        metaData: {
          first_name: findUserToVerify.firstName,
          referralCode: findUserToVerify.referralCode,
        },
      } as RegistrationEmailEvent;

      await this.emailNotificationService.sendEmail<RegistrationEmailInterface>(welcomeEmailEvent);
    }

    if (!verificationRecord) {
      throw new BadRequestException('Invalid Code');
    }

    return verificationRecord;
  }

  async verifyResend(data: VerifyResendRequestDto) {
    // #TODO - dto needed
    const user = await this.userRepository.findOne({
      email: data.email,
    });

    const verificationData: VerificationDto = {
      email: user.email,
      code: generateOtp(),
      type: VerificationTypes.USER_CREATION,
      expireIn: moment()
        .add(this.configService.get('VERIFICATION_CODE_EXPIRATION') || 5, 'm')
        .format(),
    };

    // set verification record with userId
    await this.verificationRepository.save(verificationData);

    // fetch fm template details
    const fmTemplateDetails = await this.fmTemplatesService.findByName('verify_email');

    if (fmTemplateDetails) {
      const fmTemplateMetaTagsRequestDto = plainToClass(FmTemplateMetaTagsRequestDto, {
        name: `${user.firstName}`,
        v_code: verificationData.code,
      });

      const sendTransactionEmailRequestDto = {
        id: fmTemplateDetails.templateId,
        tokens: fmTemplateMetaTagsRequestDto,
        recipient: user.email,
      };
      // send verification email with freshmarketer
      await this.freshmarketerService.sendTransactionEmail(sendTransactionEmailRequestDto);
    }

    return true;
  }

  async createGenericUser(createUserRequestDto: CreateUserRequestDto, request) {
    this.validateGenericUserData(createUserRequestDto);

    const {
      firstName,
      lastName,
      email,
      password,
      marketingOptIn,
      tcOptIn,
      roleId
    } = createUserRequestDto;

    // set userVerificationStatus and referral code
    let userVerificationStatus: UserVerificationStatusEnum;

    if (createUserRequestDto.roleId === RolesEnum.TRADESPERSON) {
      userVerificationStatus = UserVerificationStatusEnum.NOT_ADDED;
    } else if (createUserRequestDto.roleId === RolesEnum.PROJECT_OWNER) {
      userVerificationStatus = UserVerificationStatusEnum.VERIFIED;
    } else {
      this.logger.error('User role is not set');
      throw new InternalServerErrorException();
    }

    const referralCode = generateRandomNumbers();

    try {
      return await this.userRepository.manager.transaction(async (entityManager) => {
        const userData = {
          firstName,
          lastName,
          email,
          password,
          tcOptIn,
          marketingOptIn,
          userVerificationStatus,
          referralCode,
          role: {
            id: roleId
          }
        };

        const user = await entityManager.save(User, userData);

        try {
          await this.cognitoService.registerUser(
            user,
            createUserRequestDto.password,
            createCognitoContextData(request),
          );
        } catch (e) {
          // remove the mysql user if there's an error
          await this.cognitoService.deleteUser(user.email);
          throw e;
        }

        try {
          const freshMarketerContactData: CreateFreshMarketerContactRequestDto = {
            firstName: createUserRequestDto.firstName,
            lastName: createUserRequestDto.lastName,
            email: createUserRequestDto.email,
          };

          await this.freshmarketerService.createContact(freshMarketerContactData);

          await entityManager.save(UserNotificationSetting, {
            user: {
              id: user.id
            }
          });

          await entityManager.save(UserWorkstation, {
            user: {
              id: user.id
            },
            name: 'Default'
          });

          const verificationData: VerificationDto = {
            email: user.email,
            code: generateOtp(),
            type: VerificationTypes.USER_CREATION,
            expireIn: moment()
              .add(this.configService.get('VERIFICATION_CODE_EXPIRATION') || 5, 'm')
              .format(),
          };

          // fetch fm template details
          const fmTemplateDetails = await this.fmTemplatesService.findByName('verify_email');

          if (fmTemplateDetails) {
            const fmTemplateMetaTagsRequestDto = plainToClass(FmTemplateMetaTagsRequestDto, {
              name: `${user.firstName}`,
              v_code: verificationData.code,
            });

            const sendTransactionEmailRequestDto = {
              id: fmTemplateDetails.templateId,
              tokens: fmTemplateMetaTagsRequestDto,
              recipient: user.email,
            };
            // send verification email with freshmarketer
            await this.freshmarketerService.sendTransactionEmail(sendTransactionEmailRequestDto);
          }

          // set verification record with userId
          await entityManager.save(Verification, verificationData);
        } catch (e) {
          // remove the cognito user.
          await this.cognitoService.deleteUser(user.email);
          throw e;
        }

        return user;
      });
    } catch (e) {
      this.logger.error(e);
      // remove the cognito user.
      if (e.code === 400 && e.message.indexOf('Password') !== -1) {
        // invalid password for cognito
        this.logger.debug({ data: Buffer.from(createUserRequestDto?.password).toString('base64') });
        throw new BadRequestException('Password requirement not met. Please try again');
      } else {
        throw new BadRequestException('Error in creating user. Please try again');
      }
    }
  } */

}
