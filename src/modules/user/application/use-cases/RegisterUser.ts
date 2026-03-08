import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { RegisteringUser, ResponsingUser } from "../dtos/UserDTOs";
import { RequestObjectToEntityConverter } from "../mappers/RequestObjectToEntityConverter";
import { EntityToResponseConverter } from "../mappers/EntityToResponseConverter";
import { IHasher } from "../../domain/interfaces/IHasher";
import { ITokenService } from "../../domain/interfaces/ITokenService";
import { IMailService } from "../../domain/interfaces/IMailService";
import { AppError } from "../../../../shared/domain/errors/AppError";
// Import the Password Value Object
import { Password } from "../../domain/valueObjects/Password";

export class RegisterUser {
  constructor(
    private userRepository: IUserRepository,
    private hasher: IHasher,
    private tokenService: ITokenService,
    private emailSender: IMailService,
  ) {}

  async execute(dto: RegisteringUser): Promise<ResponsingUser> {
    const securePassword = Password.create(dto.password);

    const isEmailTaken = await this.userRepository.exists(dto.email);
    if (isEmailTaken) {
      throw new AppError("This email is already registered", 400);
    }

    const passwordHash = await this.hasher.hash(securePassword.getValue());

    const userEntity = RequestObjectToEntityConverter.toEntity(dto, passwordHash);
    console.log(userEntity);

    await this.userRepository.save(userEntity);

    const token = await this.tokenService.generateToken(userEntity.getId());

    await this.emailSender.sendActivationEmail(userEntity.getEmail(), token);

    return EntityToResponseConverter.toDTO(userEntity);
  }
}
