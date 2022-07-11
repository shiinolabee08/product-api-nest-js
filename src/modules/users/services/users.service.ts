import { BadRequestException, Injectable, Logger, UnprocessableEntityException } from '@nestjs/common';
import { createCognitoContextData } from '../../../common/services/aws/helpers/context-data.helper';
import { CognitoService } from '../../../common/services/aws/services/cognito.service';
import { PostCodeIoService } from '../../../common/services/postcode-io.service';
import { CreateUserRequestDto } from '../dtos/request/create-user.request.dto';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../user.entity';

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

}
